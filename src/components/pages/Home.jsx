import React from 'react';
import HeroBanner from '../Herobanner';
import ModuleList from '../ModuleList';
import WhyChoose from '../WhyChoose';
import CallToAction from '../CallToAction';
function Home() {
  return (
    <>
    <HeroBanner/>
      <ModuleList />
                <WhyChoose />
                <CallToAction />
      
    </>
  )
}

export default Home;
