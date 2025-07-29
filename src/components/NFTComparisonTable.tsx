import React from 'react';
import { useTranslation } from 'react-i18next';

const NFTComparisonTable: React.FC = () => {
  const { t } = useTranslation();

  const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const EmptyCheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
    </svg>
  );

  return (
    <div className="overflow-x-auto mt-16">
      <table className="min-w-full border-separate border-spacing-0 text-left text-light bg-[#1c3625]/80 rounded-2xl">
        <thead>
          <tr>
            <th className="px-6 py-3 font-bold text-lg align-bottom bg-transparent border border-white" rowSpan={2}></th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>TITÍ</th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>PAUJIL</th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>CARACOLÍ</th>
            <th className="px-6 py-3 font-bold text-lg text-center border border-white bg-[#1a2b14] text-white" colSpan={2}>JAGUAR</th>
          </tr>
          <tr>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
            <th className="px-4 py-2 text-center font-bold border border-white text-white bg-transparent">{t('nftTable.minFundraise')}<br/>{t('nftTable.fullFundraise')}</th>
          </tr>
        </thead>
        <tbody>
          {/* LAND RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.landRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.lifeLongMembership')}<br/><span className="text-xs font-normal">{t('nftTable.lifeLongMembershipDesc')}</span></td>
            {Array(8).fill(0).map((_,i) => <td key={i} className="px-4 py-4 text-center border border-white">{CheckIcon()}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.legalProtector')}<br/><span className="text-xs font-normal">{t('nftTable.legalProtectorDesc')}</span></td>
            {Array(8).fill(0).map((_,i) => <td key={i} className="px-4 py-4 text-center border border-white">{CheckIcon()}</td>)}
          </tr>
          {/* GOVERNANCE RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.governanceRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.daoAccess')}<br/><span className="text-xs font-normal">{t('nftTable.daoAccessDesc')}</span></td>
            {[CheckIcon(), EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          {/* ART RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.artRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.badgeArt')}<br/><span className="text-xs font-normal">{t('nftTable.badgeArtDesc')}</span></td>
            {Array(8).fill(0).map((_,i) => <td key={i} className="px-4 py-4 text-center border border-white">{CheckIcon()}</td>)}
          </tr>
          {/* MONITORING RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.monitoringRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.monitoringAccess')}<br/><span className="text-xs font-normal">{t('nftTable.monitoringAccessDesc')}</span></td>
            {[CheckIcon(), EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          {/* UTILITY RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.utilityRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.freeAccommodation')}</td>
            {[CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.freeMeals')}</td>
            {[CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.accommodationDiscount')}</td>
            {[EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.mealDiscount')}</td>
            {[EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.discountedWorkshops')}</td>
            {[EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
          {/* EDUCATION RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.educationRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.accessEducational')}<br/><span className="text-xs font-normal">{t('nftTable.accessEducationalDesc')}</span></td>
            {[EmptyCheckIcon(), t('nftTable.basicLevel'), EmptyCheckIcon(), t('nftTable.basicLevel'), t('nftTable.basicLevel'), t('nftTable.mediumLevel'), t('nftTable.mediumLevel'), t('nftTable.fullLevel')].map((val, i) => <td key={i} className="px-4 py-4 text-center border border-white">{typeof val === 'string' ? val : val}</td>)}
          </tr>
          {/* ASSET RIGHTS */}
          <tr className="bg-white/5">
            <td className="px-6 py-4 font-bold border border-white" colSpan={9}>{t('nftTable.assetRights')}</td>
          </tr>
          <tr>
            <td className="px-6 py-4 border border-white">{t('nftTable.futureUpgrades')}<br/><span className="text-xs font-normal">{t('nftTable.futureUpgradesDesc')}</span></td>
            {[CheckIcon(), EmptyCheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon(), CheckIcon()].map((icon, i) => <td key={i} className="px-4 py-4 text-center border border-white">{icon}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NFTComparisonTable; 