import { json } from '@sveltejs/kit';
import { User, Transaction, Engagement } from '$lib/server/db/models/index';
import { PAY_SECR } from '$env/static/private';

const MIN_WITHDRAWAL = 5000;
const REQUIRED_APPROVAL_RATE = 0.80; // 80%
const AUTO_APPROVE_DAYS = 3; // Engagements older than 3 days will be auto-approved

export async function POST({ request, locals }) {
	try {
		const currentUser = locals.user;
		if (!currentUser) {
			throw new Error('Authentication required.');
		}

		const { amount } = await request.json();
		if (!amount || typeof amount !== 'number') {
			throw new Error('A valid amount is required.');
		}

		const user = await User.findById(currentUser.id);

		// --- Standard Server-side validation ---
		if (!user || !user.paystackRecipientCode) {
			throw new Error('No payout account linked.');
		}
		if (user.balance < amount) {
			throw new Error('Insufficient balance.');
		}
		if (amount < MIN_WITHDRAWAL) {
			throw new Error(`Minimum withdrawal amount is ₦${MIN_WITHDRAWAL}.`);
		}

		// --- NEW: AUTOMATICALLY APPROVE OLD PENDING ENGAGEMENTS ---
		const threeDaysAgo = new Date();
		threeDaysAgo.setDate(threeDaysAgo.getDate() - AUTO_APPROVE_DAYS);

		// Find and update engagements that are 'pending' and older than 3 days
		// We use `userId: user._id` to ensure only the current user's engagements are affected.
		const { modifiedCount } = await Engagement.updateMany(
			{
				userId: user._id,
				status: 'pending',
				createdAt: { $lte: threeDaysAgo } // Engagements created on or before threeDaysAgo
			},
			{
				$set: { status: 'approved', approvedAt: new Date() }, // Set status to approved and record approval time
				$push: { notes: { content: 'Auto-approved due to inactivity.', timestamp: new Date() } } // Add a note
			}
		);

		if (modifiedCount > 0) {
			console.log(`Auto-approved ${modifiedCount} old engagements for user ${user._id}`);
			// If engagements were auto-approved, we might want to refresh the user's data
			// (though in this specific flow, we are just re-calculating the approval rate,
			// so a full refresh of the user object might not be strictly necessary here
			// if their balance isn't affected by approval itself, only by the subsequent withdrawal).
			// If approval gives direct earnings, that would also need to be handled here or in a separate process.
		}
		// --- END OF AUTO-APPROVAL ---


		// --- ETHICAL WITHDRAWAL CHECK ---
		const totalEngagements = await Engagement.countDocuments({ userId: user._id });
		const approvedEngagements = await Engagement.countDocuments({
			userId: user._id,
			status: 'approved'
		});

		let approvalRate = 0;
		if (totalEngagements > 0) {
			approvalRate = approvedEngagements / totalEngagements;
		} else {
			approvalRate = 1; // Pass if no engagements, as before.
		}

		if (approvalRate < REQUIRED_APPROVAL_RATE) {
			const currentPercentage = Math.round(approvalRate * 100);
			throw new Error(
				`Withdrawal requirement not met. Your engagement approval rate is ${currentPercentage}%, but it must be at least 80%. Please wait for more of your submissions to be reviewed and approved.`
			);
		}
		// --- END OF ETHICAL CHECK ---


		// 1. Create a pending withdrawal transaction
		const withdrawalTransaction = new Transaction({
			userId: user._id,
			type: 'withdrawal',
			amount: amount,
			status: 'pending',
			description: `Withdrawal to ${user.bankName} (${user.accountNumberLast4})`,
			paymentMethod: 'paystack'
		});
		await withdrawalTransaction.save();

		// 2. Deduct balance from user's account
		await User.findByIdAndUpdate(user._id, { $inc: { balance: -amount } });

		// 3. Initiate the transfer with Paystack
		const paystackResponse = await fetch('https://api.paystack.co/transfer', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${PAY_SECR}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				source: 'balance',
				amount: amount * 100, // Amount in KOBO
				recipient: user.paystackRecipientCode,
				reason: `Earnings withdrawal for ${user.email}`,
				reference: withdrawalTransaction._id.toString()
			})
		});

		const data = await paystackResponse.json();

		if (!data.status) {
			// --- MANUAL ROLLBACK LOGIC ---
			console.log('Paystack failed. Reverting database changes...');

			// 1. Refund the user's balance
			await User.findByIdAndUpdate(user._id, { $inc: { balance: amount } });

			// 2. Mark the transaction as failed
			withdrawalTransaction.status = 'failed';
			withdrawalTransaction.description = `Withdrawal failed: ${data.message || 'Paystack error'}`;
			await withdrawalTransaction.save();

			throw new Error(data.message || 'Paystack transfer initiation failed.');
		}

		// Update our transaction with Paystack's reference
		withdrawalTransaction.externalTransactionId = data.data.transfer_code;
		await withdrawalTransaction.save();

		return json({ message: 'Withdrawal is being processed!' });
	} catch (error) {
		console.error('Withdrawal Error:', error);
		return json({ message: error.message || 'An internal server error occurred.' }, { status: 400 });
	}
}