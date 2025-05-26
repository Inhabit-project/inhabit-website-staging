import React from 'react';
import Menu from '../components/Menu';
import InternalPagesHero from '../components/InternalPagesHero';
import InfoCard, { InfoCardRightImage } from '../components/InfoCard';
import { FAQWhite } from '../components/FAQ';
import CriteriaCardsSection from '../components/CriteriaCardsSection';
import NFTGrid from '../components/NFTGrid';
import NFTComparisonTable from '../components/NFTComparisonTable';
import Footer from '../components/Footer';

const NuiyanzhiPage: React.FC = () => (
  <>
    <Menu />
    {/* Internal Hero Section - custom for Nuiyanzhi */}
    <InternalPagesHero
      variant="nuiyanzhi"
      // Optionally, you can extend InternalPagesHero to accept custom props for this hub
    />

    {/* Section: Four goals to be a HUB */}
    <CriteriaCardsSection />

    {/* Section: The Vision (InfoCard) */}
    <InfoCard
      title="The Vision"
      text="Ñuiyanzhi Hub is a sanctuary and land guardian incubator, rooted in nature contemplation and ancestral Kogui wisdom. It blends bioclimatic design, ecological restoration, and traditional land practices, training future stewards through immersive, hands-on learning. As a center for knowledge exchange between Indigenous Elders and researchers, it fosters sustainable bioconstruction, resource recycling, and cultural continuity. Home to stewards, wildlife, and vital ecosystems, Ñuiyanzhi is a living model of Buen Vivir and ecological stewardship.

Rooted in nature contemplation, the project honors the Kogui people's timeless approach to living in balance with Nature. By merging ancestral architecture with contemporary bioclimatic design, it fosters sustainable building through bio-construction, responsible use of local materials, and resource recycling.."
      imageSrc="/assets/1Hub/vision.webp"
      imageAlt="Vision"

    />

    {/* Section: The Guardians (InfoCardRightImage) */}
    <InfoCardRightImage
      title="The Guardians"
      text="Since 2021, Amelia (Right of Nature Lawyer), Juan (Bio-climatic Architect), and their son León (Nature Monitoring Enthusiast) have stewarded Ñuiyanzhi in collaboration with the Kogi elders of the Kaggaba tribe, traditional authorities of the Sierra Nevada de Santa Marta. With academic backgrounds and a decade of experience in regenerative rural development, they co-create sustainable solutions rooted in ancestral wisdom that are applied in this HUB.

More than a place, Ñuiyanzhi is a sanctuary—home to a steward family, the Elders of the Sierra, and the birds, monkeys, bees, and plants that safeguard the waters. Ñuiyanzhi is a home for Life—an invitation to care for the Earth with tenderness, responsibility, and awareness"
      imageSrc="/assets/1Hub/guardians.webp"
      imageAlt="Guardians"
    />

    {/* Section: The Land (InfoCard) */}
    <InfoCard
      title="The Land"
      text="At its heart, Ñuiyanzhi is restoring a vital inner ecological corridor that connects to the Tayrona and Sierra Nevada National Parks. Through soil regeneration, reforestation, and a living seed bank, it supports the return of endangered species like the Blue-billed Curassow (Paujil) and White-headed Tamarin (Titi Monkey). Merging ancestral Kogui wisdom with scientific practice, it creates shared habitats that honour both ecological and cultural knowledge. This biodiversity hotspot reconnects fragmented landscapes, enabling species migration and ecological stewardship.

Rooted in nature contemplation, the project honors the Kogui people's timeless approach to living in balance with the. By merging ancestral architecture with contemporary bioclimatic design, it fosters sustainable building through bio-construction, responsible use of local materials, and resource recycling."
      imageSrc="/assets/1Hub/land.webp"
      imageAlt="Land"
    />
    <NFTGrid />
    {/* Section: FAQ */}
    <FAQWhite
      title="Frequently Asked"
      description="Questions about Nuiyanzhi Hub"
      faqItems={[
        {
          question: 'What makes the Nuiyanzhi Hub unique?',
          answer: 'Nuiyanzhi Hub is a living laboratory where ecological restoration meets ancestral knowledge, blending indigenous wisdom with modern science.'
        },
        {
          question: 'How can I become a guardian of Nuiyanzhi?',
          answer: 'You can become a guardian by acquiring a Stewardship NFT for Nuiyanzhi and participating in our restoration and stewardship programs.'
        },
        {
          question: 'What are the main goals of the Hub?',
          answer: 'The main goals are ecological restoration, knowledge sharing, community engagement, and sustainable land management.'
        },
        {
          question: 'Can I visit the Nuiyanzhi Hub?',
          answer: 'Yes, NFT stewards and guardians have exclusive opportunities to visit, learn, and participate in hands-on experiences at the Hub.'
        }
      ]}
    />
    <Footer />
  </>
);

export default NuiyanzhiPage; 