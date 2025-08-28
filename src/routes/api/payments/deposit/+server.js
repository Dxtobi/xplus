import { json, error } from '@sveltejs/kit';
import { Transaction } from '$lib/server/db/models/index';
import { PAY_SECR } from '$env/static/private';
import crypto from 'crypto';
export async function POST({ request }) {
	// 1. Get the raw request body and the signature from the header
	const requestBody = await request.text();
	const signature = request.headers.get('x-paystack-signature');

	if (!signature) {
		return new Response('Signature header not found', { status: 401 });
	}

	// 2. Securely verify the webhook signature
	// The signature is a SHA512 HMAC of the request body, using your secret key
	const hash = crypto
		.createHmac('sha512', PAY_SECR)
		.update(requestBody)
		.digest('hex');

	// Compare the generated hash with the one from Paystack
	if (hash !== signature) {
		// If they don't match, the request is not from Paystack. Reject it.
		return new Response('Invalid signature', { status: 401 });
	}

	// 3. If the signature is valid, parse the event payload
	const event = JSON.parse(requestBody);

	// 4. Process the event
	try {
        await dbConnect();

		// Use the 'reference' from Paystack, which is our internal transaction ID
		const transactionId = event.data.reference;

		// Find the transaction in your database
		const transaction = await Transaction.findById(transactionId);

		if (!transaction) {
			console.warn(`Webhook received for unknown transaction reference: ${transactionId}`);
			// Return a 200 to acknowledge receipt and prevent Paystack from retrying
			return new Response('Transaction not found', { status: 200 });
		}

		// Update transaction based on the event type
		switch (event.event) {
			case 'charge.success':
				// Check if the transaction is already completed to prevent duplicate processing
				if (transaction.status === 'completed') {
					break;
				}
				
				// Verify the amount paid matches what you expect
				const amountPaidKobo = event.data.amount;
				const expectedAmountKobo = Math.round(transaction.amount * 100);

				if (amountPaidKobo !== expectedAmountKobo) {
					console.error(`Amount mismatch for transaction ${transactionId}. Expected ${expectedAmountKobo}, got ${amountPaidKobo}`);
					transaction.status = 'failed';
					transaction.description = 'Payment failed due to amount mismatch.';
				} else {
					transaction.status = 'completed';
					// Add the actual Paystack reference if you haven't already
					transaction.externalTransactionId = event.data.reference;
				}
				break;
			
			case 'charge.failed':
				transaction.status = 'failed';
				break;
			
			// You can handle other events like 'transfer.success', 'transfer.failed' etc.
		}

		await transaction.save();

	} catch (error) {
		console.error('Webhook processing error:', error);
		// Return a 500 error to signal that something went wrong on our end
		return new Response('Internal Server Error', { status: 500 });
	}

	// 5. Acknowledge receipt of the event
	// Always return a 200 OK status to Paystack to let them know you've successfully received the webhook.
	// If you return an error, Paystack will keep retrying to send the same event.
	return new Response('Webhook received', { status: 200 });
}