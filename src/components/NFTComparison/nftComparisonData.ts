import { useTranslation } from 'react-i18next';

export type NFTPackage = 'TITÍ' | 'PAUJIL' | 'CARACOLÍ' | 'JAGUAR';
export type FundType = 'min' | 'full';

export interface NFTFeature {
  category: string;
  label: string;
  description?: string;
  values: {
    [pkg in NFTPackage]?: {
      min?: string | boolean;
      full?: string | boolean;
    }
  };
}

export const useNFTComparisonFeatures = (): NFTFeature[] => {
  const { t } = useTranslation();

  return [
    // LAND RIGHTS
    {
      category: t('nftTable.landRights'),
      label: t('nftTable.lifeLongMembership'),
      description: t('nftTable.lifeLongMembershipDesc'),
      values: {
        'TITÍ': { min: true, full: true },
        'PAUJIL': { min: true, full: true },
        'CARACOLÍ': { min: true, full: true },
        'JAGUAR': { min: true, full: true },
      },
    },
    {
      category: t('nftTable.landRights'),
      label: t('nftTable.legalProtector'),
      description: t('nftTable.legalProtectorDesc'),
      values: {
        'TITÍ': { min: true, full: true },
        'PAUJIL': { min: true, full: true },
        'CARACOLÍ': { min: true, full: true },
        'JAGUAR': { min: true, full: true },
      },
    },
    // GOVERNANCE RIGHTS
    {
      category: t('nftTable.governanceRights'),
      label: t('nftTable.daoAccess'),
      description: t('nftTable.daoAccessDesc'),
      values: {
        'TITÍ': { min: true, full: false },
        'PAUJIL': { min: true, full: true },
        'CARACOLÍ': { min: true, full: true },
        'JAGUAR': { min: true, full: true },
      },
    },
    // ART RIGHTS
    {
      category: t('nftTable.artRights'),
      label: t('nftTable.badgeArt'),
      description: t('nftTable.badgeArtDesc'),
      values: {
        'TITÍ': { min: true, full: true },
        'PAUJIL': { min: true, full: true },
        'CARACOLÍ': { min: true, full: true },
        'JAGUAR': { min: true, full: true },
      },
    },
    // MONITORING RIGHTS
    {
      category: t('nftTable.monitoringRights'),
      label: t('nftTable.monitoringAccess'),
      description: t('nftTable.monitoringAccessDesc'),
      values: {
        'TITÍ': { min: true, full: false },
        'PAUJIL': { min: true, full: true },
        'CARACOLÍ': { min: true, full: true },
        'JAGUAR': { min: true, full: true },
      },
    },
    // UTILITY RIGHTS
    {
      category: t('nftTable.utilityRights'),
      label: t('nftTable.freeAccommodation'),
      values: {
        'TITÍ': { min: false, full: false },
        'PAUJIL': { min: '1 day', full: '1 day' },
        'CARACOLÍ': { min: '2 days', full: '3 days' },
        'JAGUAR': { min: '3 days', full: '4 days' },
      },
    },
    {
      category: t('nftTable.utilityRights'),
      label: t('nftTable.freeMeals'),
      values: {
        'TITÍ': { min: false, full: false },
        'PAUJIL': { min: '3 days', full: '4 days' },
        'CARACOLÍ': { min: '4 days', full: '4 days' },
        'JAGUAR': { min: '4 days', full: '4 days' },
      },
    },
    {
      category: t('nftTable.utilityRights'),
      label: t('nftTable.accommodationDiscount'),
      values: {
        'TITÍ': { min: false, full: false },
        'PAUJIL': { min: '10%', full: '10%' },
        'CARACOLÍ': { min: '20%', full: '30%' },
        'JAGUAR': { min: '20%', full: '30%' },
      },
    },
    {
      category: t('nftTable.utilityRights'),
      label: t('nftTable.mealDiscount'),
      values: {
        'TITÍ': { min: false, full: false },
        'PAUJIL': { min: '10%', full: '10%' },
        'CARACOLÍ': { min: '20%', full: '30%' },
        'JAGUAR': { min: '20%', full: '30%' },
      },
    },
    {
      category: t('nftTable.utilityRights'),
      label: t('nftTable.discountedWorkshops'),
      values: {
        'TITÍ': { min: false, full: false },
        'PAUJIL': { min: '1 workshop', full: '1 workshop' },
        'CARACOLÍ': { min: '2 workshops', full: '2 workshops + 1 personalized workshop' },
        'JAGUAR': { min: '2 workshops', full: '2 workshops + 2 personalized workshops' },
      },
    },
    // EDUCATION RIGHTS
    {
      category: t('nftTable.educationRights'),
      label: t('nftTable.accessEducational'),
      description: t('nftTable.accessEducationalDesc'),
      values: {
        'TITÍ': { min: false, full: t('nftTable.basicLevel') },
        'PAUJIL': { min: t('nftTable.basicLevel'), full: t('nftTable.basicLevel') },
        'CARACOLÍ': { min: t('nftTable.basicLevel'), full: t('nftTable.mediumLevel') },
        'JAGUAR': { min: t('nftTable.mediumLevel'), full: t('nftTable.fullLevel') },
      },
    },
    // ASSET RIGHTS
    {
      category: t('nftTable.assetRights'),
      label: t('nftTable.futureUpgrades'),
      description: t('nftTable.futureUpgradesDesc'),
      values: {
        'TITÍ': { min: true, full: false },
        'PAUJIL': { min: true, full: true },
        'CARACOLÍ': { min: true, full: true },
        'JAGUAR': { min: true, full: true },
      },
    },
  ];
}; 