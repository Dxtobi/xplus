

import { TransactionModel, UserProfileModel } from '$lib/server/db/models/Helpers.js';
import { api } from '$lib/services/ApiService.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
  
  if (locals.user) {
     const transactions =  JSON.stringify(await TransactionModel.getUserTransactions(locals.user._id))
     const transactionStats =  JSON.stringify(await TransactionModel.getTransactionStats(locals.user._id))

     return {
      transactions:JSON.parse(transactions),
      transactionStats:JSON.parse(transactionStats),
     }
  }else{
    redirect(301, '/login')
  }
}