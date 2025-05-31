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
    <FAQWhite
      title="Four Criteria "
      description="to be a HUB"
      faqItems={[
        {
          question: '01 Biodiversity Hotspot – "Living seed hub"',
          answer: `Ñuiyanzhi Hub will regenerate soils affected by degradation and agrochemicals, restoring the full diversity and functionality of these ecosystems and transforming the site into a safe haven for endangered species. The project will restore an inner ecological corridor to support species migration and biodiversity recovery. By planting the widest variety of species, it will create a "living seed bank" that animals and humans can naturally transport and disperse, expanding biodiversity across the landscape.\nThe important focus on bioclimatic and organic architecture inspired by ancestral Kogui tradition and the use of natural materials will help create conservation areas where humans and other species can coexist, minimising environmental impact, and strengthening the symbiosis between living spaces and nature.`
        },
        {
          question: '02 Land Guardians Incubator – "Learning through living"',
          answer: `Ñuiyanzhi Hub serves as a training center for future land guardians, offering hands-on experience in ecological restoration, bioclimatic architecture, and traditional land practices. Through immersive learning programs that integrate ancestral wisdom with academic and systemic insights, it cultivates a new generation of stewards capable of adapting and replicating these practices in other territories.\nThe approach emphasises "learning through living," where participants engage directly with the environment, its natural cycles, experiencing the rhythms of daily stewardship and fostering a deep understanding of ecological dynamics and the interconnectedness of all living things. Situated within the Sierra and connected to both the sea and the river, Ñuiyanzhi provides an opportunity to witness ecological restoration firsthand, as evidenced by the return of bird species and the land's recovery under local stewardship. The initiative highlights the role of guardianship, where individuals learn from Indigenous elders who share knowledge rooted in the Law of Origin—an ecological and spiritual framework guiding sustainable coexistence with nature.\nBy actively participating in this process, trainees not only acquire practical skills but also cultivate a lasting commitment to promoting sustainability and enhancing biodiversity in their own communities. The Ñuiyanzhi experience fosters ecological balance, cultural sustainability, and the principles of Buen Vivir (Good Living), which integrates well-being, sustainability, and reciprocity within the social and ecological fabric.`
        },
        {
          question: '03 Wisdom Hub – "Meeting of knowledge"',
          answer: `Ñuiyanzhi Hub is an Action Research Center for soil restoration and bioclimatic architecture, serving as a space for reflection, exchange, and knowledge production through the encounter between Indigenous Kogui Elders and academics, both dedicated to these research areas. The Hub's spatial development embodies the meeting of knowledge, integrating the Kogui people's values of harmony with nature and contemporary insights.\nThrough workshops, residencies, seminars, and immersive practices, it facilitates dialogue between local communities, researchers, architects, farmers, and students, promoting a holistic vision of territorial regeneration. This space fosters healing and renewal, acknowledging past impacts, while uniting traditional wisdom with scientific understanding.`
        },
        {
          question: '04 Corridor Pathfinder – "Corridor of Knowledge"',
          answer: `Between Tayrona National Park and the Sierra Nevada National Park, between the basins of the Piedras River and the Mendihuaca River, Ñuiyanzhi Hub contributes to the creation of an ecological corridor by reconnecting fragmented landscapes and enabling wildlife movement. The area serves as a corridor for migratory species and mammals such as the Central American agouti (Dasyprocta punctata), as well as critically endangered species like the Blue-billed Curassow (Crax alberti), White-headed Tamarin (Saguinus oedipus), and Howler Monkeys (Alouatta spp.). Through soil regeneration and reforestation, it helps bring back functional ecosystems that connect natural habitats. Additionally, it engages local communities and territorial actors in the co-design of the corridor, mapping and reforesting along the watershed, ensuring ecological continuity and participatory management at bioregional level. Ñuiyanzhi is also committed to extending a corridor of knowledge, sharing and propagating the insights generated through the encounter of diverse knowledge systems along the corridor and beyond.`
        }
      ]}
    />

    {/* Section: The Vision (InfoCard) */}
    <InfoCard
      title="The Vision"
      text="Ñuiyanzhi Hub is a sanctuary and land guardians incubator, rooted in nature contemplation and ancestral Kogui wisdom. It blends ecological restoration, bioclimatic design, and traditional land practices, training future stewards through immersive, hands-on learning. As a center for knowledge exchange between Indigenous Elders and researchers, it fosters soil regeneration, sustainable bioconstruction, resource recycling, and cultural continuity. Home to stewards, wildlife, and vital ecosystems, Ñuiyanzhi is a living model of Buen Vivir and ecological stewardship.\n\nRooted in nature contemplation and biomimicry, the project honors the Kogui people's timeless approach to living in balance with Nature. By blending ancestral wisdom with modern ecological design, Ñuiyanzhi becomes a living lab where future guardians learn through land-based regenerative practice."
      imageSrc="/assets/1Hub/vision.webp"
      imageAlt="Vision"
    />

    {/* Section: The Guardians (InfoCardRightImage) */}
    <InfoCardRightImage
      title="The Guardians"
      text="Since 2021, Amelia (Right of Nature Lawyer), Juan (Bio-climatic Architect), and their son León (Nature Monitoring Enthusiast) have stewarded Ñuiyanzhi in collaboration with the Kogi elders of the Kaggaba tribe, traditional authorities of the Sierra Nevada de Santa Marta. With academic backgrounds and a decade of experience in regenerative rural development, they co-create sustainable solutions rooted in ancestral wisdom that are applied in this HUB.\n\nMore than a place, Ñuiyanzhi is a sanctuary—home to a steward family, the Elders of the Sierra, and the birds, monkeys, bees, and plants that safeguard the waters. Ñuiyanzhi is a home for Life—an invitation to care for the Earth with tenderness, responsibility, and awareness"
      imageSrc="/assets/1Hub/guardians.webp"
      imageAlt="Guardians"
    />

     {/* Section: The Land (InfoCard) */}
     <InfoCard
        title="The Land"
        text="At its heart, Ñuiyanzhi is restoring a vital inner ecological corridor that connects to the Tayrona and Sierra Nevada National Parks. Through soil regeneration, reforestation, and a living seed bank, it supports the return of endangered species like the Blue-billed Curassow (Paujil) and White-headed Tamarin (Titi Monkey). Merging ancestral Kogui wisdom with scientific practice, it creates shared habitats that honour both ecological and cultural knowledge. This biodiversity hotspot reconnects fragmented landscapes, enabling species migration and ecological stewardship.\n\nRooted in nature contemplation, the project honors the Kogui people's timeless approach to living in balance with the. By merging ancestral architecture with contemporary bioclimatic design, it fosters sustainable building through bio-construction, responsible use of local materials, and resource recycling."
        imageSrc="/assets/1Hub/land.webp"
        imageAlt="Land"
        showPopupButton={true}
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