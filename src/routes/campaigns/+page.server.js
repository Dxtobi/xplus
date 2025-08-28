
import { ApiHelpers } from '$lib/server/db/models/index.js';
import { api } from '$lib/services/ApiService.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
  
  if (locals.user) {
      const data = JSON.stringify(await ApiHelpers.getUserCampaigns(locals.user._id, 1, 20, 'active'))
      const page = 1; 
      const creatorId = locals.user.id;
  
  const submissionData = JSON.stringify(await ApiHelpers.getPendingEngagementsForCreator(creatorId, page));
     return {
      availableCampaigns:JSON.parse(data),
      submissionData:JSON.parse(submissionData),
     }
  }else{
    redirect(301, '/login')
  }
}



