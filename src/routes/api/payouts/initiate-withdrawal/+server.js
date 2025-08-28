import { json } from '@sveltejs/kit';
// Make sure to import the Engagement model
import { User, Transaction, Engagement } from '$lib/server/db/models/index';
import { PAY_SECR } from '$env/static/private';

const MIN_WITHDRAWAL = 5000;
const REQUIRED_APPROVAL_RATE = 0.80; // 80%

export async function POST({ request, locals }) {
	// --- NO SESSION OR TRANSACTION NEEDED ---

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

		// --- NEW ETHICAL WITHDRAWAL CHECK ---
		// 1. Get the total number of engagements the user has submitted.
		const totalEngagements = await Engagement.countDocuments({ userId: user._id });

		// 2. Get the number of their engagements that have been approved.
		const approvedEngagements = await Engagement.countDocuments({
			userId: user._id,
			status: 'approved'
		});

		// 3. Calculate the approval rate.
		let approvalRate = 0;
		if (totalEngagements > 0) {
			approvalRate = approvedEngagements / totalEngagements;
		} else {
			// If the user has zero engagements, they automatically pass this check.
			// This allows users to withdraw funds they may have from a signup bonus
			// or other means without needing to engage first.
			approvalRate = 1; // Set to 100% to pass the check.
		}

		// 4. Check if the user meets the required approval rate.
		if (approvalRate < REQUIRED_APPROVAL_RATE) {
			const currentPercentage = Math.round(approvalRate * 100);
			// Provide a clear, actionable error message to the user.
			throw new Error(
				`Withdrawal requirement not met. Your engagement approval rate is ${currentPercentage}%, but it must be at least 80%. Please wait for more of your submissions to be reviewed and approved.`
			);
		}
		// --- END OF NEW CHECK ---


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
		// We use $inc for a safer update
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
			// If Paystack fails, we reverse our database operations.
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
		// Return the specific, user-friendly error message we created
		return json({ message: error.message || 'An internal server error occurred.' }, { status: 400 });
	}
}