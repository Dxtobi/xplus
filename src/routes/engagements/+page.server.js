
import { ApiHelpers } from '$lib/server/db/models/index.js';
import { api } from '$lib/services/ApiService.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
  
  if (locals.user) {
    
      const page = 1; 
      const creatorId = locals.user.id;
  
  const submissionData = JSON.stringify(await ApiHelpers.getEngagementHistoryForEarner(locals.user.id, 1, 50, 'pending'))
  const reviewData = JSON.stringify(await ApiHelpers.getPendingEngagementsForCreator(locals.user._id, 1, 50))
     return {
      reviewSubmissions:JSON.parse(reviewData),
      mySubmissions:JSON.parse(submissionData),
     }
  }else{
    redirect(301, '/login')
  }
}



