

import { UserProfileModel } from '$lib/server/db/models/Helpers.js';
import { api } from '$lib/services/ApiService.svelte.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals }) {
  
  if (locals.user) {
     const profile =  JSON.stringify(await UserProfileModel.getUserProfile(locals.user._id))
     const campaignSummary =  JSON.stringify(await UserProfileModel.getUserCampaignSummary(locals.user._id))

     return {
      profile:JSON.parse(profile),
      campaignSummary:JSON.parse(campaignSummary),
     }
  }else{
    redirect(301, '/login')
  }
  
  
  
}