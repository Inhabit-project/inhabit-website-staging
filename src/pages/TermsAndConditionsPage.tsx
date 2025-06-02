import React from 'react';
import Menu from '../components/Menu';
import Footer from '../components/Footer';

const TermsAndConditionsPage: React.FC = () => (
  <div className="min-h-screen background-gradient-light">
    <Menu />
    <section className="w-full flex flex-col items-center justify-center py-32 background-gradient-light">
      <div className="w-full max-w-[120rem] mx-auto px-[clamp(1.5rem,5vw,6.25rem)] flex flex-col items-start gap-8">
        <div className="flex flex-col md:flex-row items-start justify-between responsive-gap w-full mb-[2.5rem]">
          <h2 className="heading-2 text-secondary max-w-[40.9375rem]">
            Terms and<br /><strong>Conditions</strong>
          </h2>
          <p className="body-M text-secondary max-w-[36rem]">
            Please read these terms carefully before using our website or services.
          </p>
        </div>
      </div>
    </section>
    <div className="container mx-auto py-16 px-4 max-w-3xl">
      <p className="body-M mb-4 text-secondary">[Insert your terms and conditions content here.]</p>
    </div>
    <Footer />
  </div>
);

export default TermsAndConditionsPage; 