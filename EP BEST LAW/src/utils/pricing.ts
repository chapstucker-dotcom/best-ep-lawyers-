import { Plan } from '../data/types';

export function calculateSubscriptionPrice(
  plan: Plan,
  attorneyCount: number
): number {
  const basePrice = plan.priceMonth;
  const includedAttorneys = plan.attorneyProfileLimit;
  
  if (attorneyCount <= includedAttorneys) {
    return basePrice;
  }
  
  const additionalAttorneys = attorneyCount - includedAttorneys;
  const additionalCost = additionalAttorneys * plan.additionalAttorneyPrice;
  
  return basePrice + additionalCost;
}

export function calculateProration(
  currentPlan: Plan,
  newPlan: Plan,
  currentAttorneyCount: number,
  newAttorneyCount: number,
  daysRemaining: number,
  daysInPeriod: number = 30
): number {
  const currentPrice = calculateSubscriptionPrice(currentPlan, currentAttorneyCount);
  const newPrice = calculateSubscriptionPrice(newPlan, newAttorneyCount);
  
  const unusedCredit = (currentPrice / daysInPeriod) * daysRemaining;
  const newCharge = (newPrice / daysInPeriod) * daysRemaining;
  
  return newCharge - unusedCredit;
}


