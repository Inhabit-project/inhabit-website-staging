// NFT comparison data for TITÍ, PAUJIL, CARACOLÍ, JAGUAR
// Each feature includes its category, label, description, and values for each package (min/full)

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

export const nftComparisonFeatures: NFTFeature[] = [
  // LAND RIGHTS
  {
    category: 'LAND RIGHTS',
    label: 'Life-long Membership & Stewardship',
    description: 'You gain lifelong stewardship and utility rights over a tokenized real-world land.',
    values: {
      'TITÍ': { min: true, full: true },
      'PAUJIL': { min: true, full: true },
      'CARACOLÍ': { min: true, full: true },
      'JAGUAR': { min: true, full: true },
    },
  },
  {
    category: 'LAND RIGHTS',
    label: 'Legal Protector of the land',
    description: 'You become part of the legal system of guarantee that recognizes Nature as a subject with rights on a specific land related to this membership, in line with the Declaration of the Rights of Nature and Biocultural principles.',
    values: {
      'TITÍ': { min: true, full: true },
      'PAUJIL': { min: true, full: true },
      'CARACOLÍ': { min: true, full: true },
      'JAGUAR': { min: true, full: true },
    },
  },
  // GOVERNANCE RIGHTS
  {
    category: 'GOVERNANCE RIGHTS',
    label: 'Inhabit DAO access',
    description: 'You receive governance rights over specific matters as a land guarantor. You have a say in decisions regarding unexpected changes in land use, shifts in Hub management, or any unforeseen events that could alter the relationship between stakeholders and the land or threaten the Rights of Nature.',
    values: {
      'TITÍ': { min: true, full: false },
      'PAUJIL': { min: true, full: true },
      'CARACOLÍ': { min: true, full: true },
      'JAGUAR': { min: true, full: true },
    },
  },
  // ART RIGHTS
  {
    category: 'ART RIGHTS',
    label: 'Badge of legal protector via exclusive ArtWork by Jeisson Castillo',
    description: 'Each ArtPiece represents a Migratory Floating Garden from the HUB\'s ecosystem, featuring a native species vital to that habitat and tied to levels of care in Kogui ancestral thinking. The unique Art Badge symbolizes your legal stewardship connection to a specific piece of land, which you can use to travel and activate the corridor.',
    values: {
      'TITÍ': { min: true, full: true },
      'PAUJIL': { min: true, full: true },
      'CARACOLÍ': { min: true, full: true },
      'JAGUAR': { min: true, full: true },
    },
  },
  // MONITORING RIGHTS
  {
    category: 'MONITORING RIGHTS',
    label: 'Impact Monitoring access via MAP HERE',
    description: 'Track the progress of the land you help protect through real-time data mapping and geolocation narratives. Follow the transformation of the land into a Biocultural hub. You receive regular real-time data and impact reports, geolocation, visual mapping, and key performance indicators (KPIs) detailing progress in areas like tree planting, biodiversity increase, and local community impact.',
    values: {
      'TITÍ': { min: true, full: false },
      'PAUJIL': { min: true, full: true },
      'CARACOLÍ': { min: true, full: true },
      'JAGUAR': { min: true, full: true },
    },
  },
  // UTILITY RIGHTS
  {
    category: 'UTILITY RIGHTS',
    label: 'Free accommodation',
    values: {
      'TITÍ': { min: false, full: false },
      'PAUJIL': { min: '1 day', full: '1 day' },
      'CARACOLÍ': { min: '2 days', full: '3 days' },
      'JAGUAR': { min: '3 days', full: '4 days' },
    },
  },
  {
    category: 'UTILITY RIGHTS',
    label: 'Free meals',
    values: {
      'TITÍ': { min: false, full: false },
      'PAUJIL': { min: '3 days', full: '4 days' },
      'CARACOLÍ': { min: '4 days', full: '4 days' },
      'JAGUAR': { min: '4 days', full: '4 days' },
    },
  },
  {
    category: 'UTILITY RIGHTS',
    label: 'Accommodation discount',
    values: {
      'TITÍ': { min: false, full: '10%' },
      'PAUJIL': { min: false, full: '20%' },
      'CARACOLÍ': { min: '20%', full: '30%' },
      'JAGUAR': { min: '20%', full: '30%' },
    },
  },
  {
    category: 'UTILITY RIGHTS',
    label: 'Meal discount',
    values: {
      'TITÍ': { min: false, full: '10%' },
      'PAUJIL': { min: false, full: '20%' },
      'CARACOLÍ': { min: '20%', full: '30%' },
      'JAGUAR': { min: '20%', full: '30%' },
    },
  },
  {
    category: 'UTILITY RIGHTS',
    label: 'Discounted workshops',
    values: {
      'TITÍ': { min: false, full: '1 workshop' },
      'PAUJIL': { min: false, full: '1 workshop' },
      'CARACOLÍ': { min: '2 workshops', full: '2 workshops + 1 personalized workshop' },
      'JAGUAR': { min: '2 workshops', full: '2 workshops + 2 personalized workshops' },
    },
  },
  // EDUCATION RIGHTS
  {
    category: 'EDUCATION RIGHTS',
    label: 'Access to educational contents',
    description: 'About inhabiting knowledge and techniques',
    values: {
      'TITÍ': { min: false, full: 'Basic level' },
      'PAUJIL': { min: false, full: 'Basic level' },
      'CARACOLÍ': { min: 'Basic level', full: 'Medium level' },
      'JAGUAR': { min: 'Medium level', full: 'Full level' },
    },
  },
  // ASSET RIGHTS
  {
    category: 'ASSET RIGHTS',
    label: 'Future NFT upgrades',
    description: 'As an early backer, you are entitled to receive future versions of the NFT for free, which will include additional rights and benefits as the project evolves in the NFT 2.0 (conditional on development).',
    values: {
      'TITÍ': { min: true, full: false },
      'PAUJIL': { min: true, full: true },
      'CARACOLÍ': { min: true, full: true },
      'JAGUAR': { min: true, full: true },
    },
  },
]; 