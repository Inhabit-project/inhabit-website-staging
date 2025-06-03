import React from 'react';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen background-gradient-light">
      <Menu />
      <section className="w-full flex flex-col items-center justify-center py-32 background-gradient-light">
        <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-start gap-8">
          <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
            <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
              {t('privacyPolicy.title')}
            </h2>
            <p className="body-M text-secondary max-w-[36rem]">
              {t('privacyPolicy.intro')}
            </p>
          </div>
        </div>
      </section>
      <div className="container mx-auto py-16 px-4 max-w-3xl background-gradient-light rounded-lg">
        <h6 className="text-secondary font-bold mb-4">{t('privacyPolicy.dataProtectionAndManagementPolicy')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.dataProtectionAndManagementPolicyDescription')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.dataProtectionAndManagementPolicyRevised')}</p>
        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.howWeUse')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.howWeUseDescription')}</p>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.awareness')}</li>
          <li>{t('privacyPolicy.nftDistribution')}</li>
          <li>{t('privacyPolicy.socialization')}</li>
          <li>{t('privacyPolicy.buildingSupportNetworks')}</li>
          <li>{t('privacyPolicy.reportingToMembers')}</li>
          <li>{t('privacyPolicy.governance')}</li>
          <li>{t('privacyPolicy.reportingToInstitutions')}</li>
          <li>{t('privacyPolicy.support')}</li>
        </ul>
        <p className="text-secondary mb-4">{t('privacyPolicy.howWeUseAdditional')}</p>
        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.howWeShare')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.howWeShareDescription')}</p>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.analytics')}</li>
        </ul>
        <p className="text-secondary mb-4">{t('privacyPolicy.howWeShareAdditional')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.howWeShareDisclosure')}</p>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.complyWithApplicableLaws')}</li>
          <li>{t('privacyPolicy.enforceAgreements')}</li>
          <li>{t('privacyPolicy.respondToClaims')}</li>
          <li>{t('privacyPolicy.ifServiceMerged')}</li>
        </ul>
        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.yourRights')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.yourRightsDescription')}</p>
        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.cookies')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.cookiesDescription')}</p>
        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.security')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.securityDescription')}</p>
        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.complaintsOfficer')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.complaintsOfficerDescription')}</p>
        <p className="text-secondary mb-6">{t('privacyPolicy.creationDate')}</p>

        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.personalDataProtectionPolicy')}</h6>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.purpose')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.purposeDescription')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.disclosure')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.scope')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.scopeDescription')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.informationOfTheDataController')}</h6>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.companyName')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.address')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.email')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.telephone')}</li>
        </ul>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.toWhomIsTheDataProcessingPolicyAddressed')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.toWhomIsTheDataProcessingPolicyAddressedDescription')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.purposeOfProcessing')}</h6>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.purposeOfProcessingMembers')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.purposeOfProcessingGuardians')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.purposeOfProcessingPartnerOrganizations')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.purposeOfProcessingSuppliers')}</li>
        </ul>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.definitions')}</h6>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.authorization')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.database')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.personalData')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.dataProcessor')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.dataController')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.dataSubject')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.processing')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.sensitiveData')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.publicData')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.privacyNotice')}</li>
        </ul>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.privacyNoticeDescription')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.principles')}</h6>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfPurpose')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfFreedom')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfTruthfulness')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfTransparency')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfRestrictedAccess')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfSecurity')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.principleOfConfidentiality')}</li>
        </ul>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.authorization')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.authorizationDescription')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.authorizationMechanisms')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.authorizationProof')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.authorizationRevocation')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.rightsAndDuties')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightsAndDutiesDescription')}</p>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.rightsOfDataSubjects')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.legalStanding')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.duties')}</li>
        </ul>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightOfAccess')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightOfAccessDescription')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdate')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdateClaims')}</p>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdateClaimsDescription')}</li>
          <li>{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdateClaimsProof')}</li>
        </ul>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdateRevocation')}</p>
        <ul className="list-disc pl-6 text-secondary mb-4">
          <li>{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdateRevocationDescription')}</li>
        </ul>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.rightToUpdateImplementation')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.informationSecurity')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.informationSecurityDescription')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.finalProvisions')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.finalProvisionsDescription')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.personalDataProtectionPolicy.validity')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.personalDataProtectionPolicy.validityDescription')}</p>

        <h6 className="text-secondary font-bold mb-4 mt-8" id="cookie-policy">{t('privacyPolicy.cookiePolicy')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.cookiePolicyDescription')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.cookiePolicyAdditional')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.cookiePolicyInformation')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.cookiePolicyPersonalData')}</p>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.cookiePolicyDisabling')}</h6>
        <p className="text-secondary mb-4">{t('privacyPolicy.cookiePolicyDisablingDescription')}</p>

        <h6 className="text-secondary font-bold mb-4 mt-8">{t('privacyPolicy.annexNo1')}</h6>
        <h6 className="text-secondary font-bold mb-2 mt-6">{t('privacyPolicy.annexNo1NotificationTemplate')}</h6>
        <p className="text-secondary mb-4 font-semibold">{t('privacyPolicy.annexNo1Declaration')}</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.annexNo1Authorization')}</p>
        <p className="text-secondary mb-4">______________________________________</p>
        <p className="text-secondary mb-4">{t('privacyPolicy.annexNo1Note')}</p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage; 