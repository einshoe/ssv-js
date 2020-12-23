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
    expect(ssv.getTraceVisibility('sky')).to.equal(true)
  });

  it('SSV build Marz spectra chart', () => {
    const ssv = new SSV('test2');
    ssv.initialise();
    expect(ssv.getName()).to.equal('test2');

    ssv.setTrace('wavelength',[2000.0,2010.0,2020.0]);
    ssv.setTrace('intensity',[10.0,20.0,30.0]);
    ssv.setXAxisTitle('wavelength', 'Wavelength');
    ssv.setYAxisTitle('intensity', 'Intensity');
    ssv.addPin('pick point', 2005, 10);
    ssv.prepareDataForVegaSpec();
    let chart = ssv.getVegaSpec(1000, 500, 1990.0, 2030.0, 0.0, 40.0);
    expect(chart.width).to.equal(1000);
    expect(chart.height).to.equal(500);
    //console.log(chart);
  });

  it('SSV build Marz cross correlation chart', () => {
    const ssv = new SSV('test3');
    ssv.initialise();
    expect(ssv.getName()).to.equal('test3');

    ssv.setTrace('wavelength',[2000.0,2010.0,2020.0]);
    ssv.setTrace('intensity',[10.0,20.0,30.0]);
    ssv.setXAxisTitle('wavelength', 'Wavelength');
    ssv.setYAxisTitle('intensity', 'Intensity');
    ssv.addPin('pick point', 2005, 10);
    ssv.prepareDataForVegaSpec();
    let xcorrelation_chart = ssv.getVegaSpecForCrossCorrelation(1000, 500);
    expect(xcorrelation_chart.width).to.equal(1000);
    expect(xcorrelation_chart.height).to.equal(500);
  });

  it('SSV build Marz callout chart', () => {
    const ssv = new SSV('test4');
    ssv.initialise();
    expect(ssv.getName()).to.equal('test4');

    ssv.setTrace('wavelength',[2000.0,2010.0,2020.0]);
    ssv.setTrace('intensity',[10.0,20.0,30.0]);
    ssv.setXAxisTitle('wavelength', 'Wavelength');
    ssv.setYAxisTitle('intensity', 'Intensity');
    ssv.addPin('pick point', 2005, 10);
    ssv.prepareDataForVegaSpec();
    let callout_chart = ssv.getVegaSpec(1000, 500, 1990.0, 2030.0, 0.0, 40.0, false, false);
    expect(callout_chart.width).to.equal(1000);
    expect(callout_chart.height).to.equal(500);
  });

});
