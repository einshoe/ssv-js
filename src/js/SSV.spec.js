import { SSV } from "./SSV";

describe('true or false', () => {
  var expect = require('chai').expect;
  it('SSV creator', () => {
    const ssv = new SSV('test1');
    expect(ssv.getName()).to.equal('test1')
  });

  it('SSV setters and getters', () => {
    const ssv = new SSV('test2');
    expect(ssv.getName()).to.equal('test2');

    ssv.setTrace('sky','blah');
    ssv.setTraceVisibility('sky',true);
    ssv.setTraceXOffset('intensity', 100.0);
    ssv.setTraceYOffset('intensity', 200.0);
    ssv.setXAxisTitle('wavelength', 'Wavelength');
    ssv.setYAxisTitle('intensity', 'Intensity');
    ssv.addPin('pick point', 5, 10);
    ssv.setVRule('line1', 4000);
    expect(ssv.getTraceVisibility('sky')).to.equal(true)
  });

  it('SSV build spectra chart', () => {
    const ssv = new SSV('test2');
    ssv.initialise();
    expect(ssv.getName()).to.equal('test2');

    ssv.setTrace('wavelength',[2000.0,2010.0,2020.0]);
    ssv.setTrace('intensity',[10.0,20.0,30.0]);
    ssv.setXAxisTitle('wavelength', 'Wavelength');
    ssv.setYAxisTitle('intensity', 'Intensity');
    ssv.addPin('pick point', 2005, 10);
    ssv.setVRule('line1', 4000);
    ssv.prepareDataForVegaSpec();
    let chart = ssv.getVegaSpec(1000, 500, 1990.0, 2030.0, 0.0, 40.0);
    expect(chart.width).to.equal(1000);
    expect(chart.height).to.equal(500);
    console.log(chart);
  });

});
