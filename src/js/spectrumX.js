export class SpectrumX {
    constructor(name) {
        this.wavelength = [];
        this.intensity = [];
        this.variance = [];
        this.sky = [];
        this.dohelio = false;
        this.docmb = false;

        //
        this.properties = {};
        this.properties.id = "";
        this.properties.name = name;
        this.properties.ra = null;
        this.properties.dec = null;
        this.properties.magnitude = null;

        this.properties.type = "";
        this.properties.longitude = null;
        this.properties.longitude = null;
        this.properties.latitude = null;
        this.properties.altitude = null;
        this.properties.juliandate = "";
        this.properties.epoch = ""
        this.properties.radecsys = "";


        // one way to handle missing properties (good enough for the ui)
        this.properties.ra = 0;
        this.properties.dec = 0;
        this.properties.magnitude = 0;
        this.properties.longitude = 0;
        this.properties.longitude = 0;
        this.properties.latitude = 0;
        this.properties.altitude = 0;
    }
    fromDictionary(dict)
    {
        if (dict["wavelength"]) {
            this.wavelength = dict["wavelength"];
        }
        if (dict["intensity"]) {
            this.intensity = dict["intensity"];
        }
        if (dict["variance"]) {
            this.variance = dict["variance"];
        }
        if (dict["sky"]) {
            this.sky = dict["sky"];
        }
        if (dict["dohelio"]) {
            this.dohelio = dict["dohelio"];
        }
        if (dict["docmb"]) {
            this.docmb = dict["docmb"];
        }

        if (dict["properties"]) {
            this.properties = dict["properties"];
            // TODO: The code below is not required (unless I want some kind of checking here)
            if (this.properties["id"]) {
                this.properties.id = this.properties["id"];
            }
            if (this.properties["name"]) {
                this.properties.name = this.properties["name"];
            }
            if (this.properties["type"]) {
                this.properties.type = this.properties["type"];
            }
            if (this.properties["ra"]) {
                this.properties.ra = this.properties["ra"];
            } else {
                this.properties.ra = 0;
            }
            if (this.properties["dec"]) {
                this.properties.dec = this.properties["dec"];
            } else {
                this.properties.dec = 0;
            }
            if (this.properties["magnitude"]) {
                this.properties.magnitude = this.properties["magnitude"];
            } else {
                this.properties.magnitude = 0;
            }
            if (this.properties["longitude"]) {
                this.properties.longitude = this.properties["longitude"];
            } else {
                this.properties.longitude = 0;
            }
            if (this.properties["latitude"]) {
                this.properties.latitude = this.properties["latitude"];
            } else {
                this.properties.latitude = 0;
            }
            if (this.properties["altitude"]) {
                this.properties.altitude = this.properties["altitude"];
            } else {
                this.properties.altitude = 0;
            }
            if (this.properties["juliandate"]) {
                this.properties.juliandate = this.properties["juliandate"];
            }
            if (this.properties["epoch"]) {
                this.properties.epoch = this.properties["epoch"];
            }
            if (this.properties["radecsys"]) {
                this.properties.radecsys = this.properties["radecsys"];
            }
        }
    }
    // Description properties
    getId() {
        return this.properties.id;
    }
    setId(id) {
        this.properties.id = id;
    }
    getName() {
        return this.properties.name;
    }
    setName(name) {
        this.properties.name = name;
    }
    getRightAscension() {
        return this.properties.ra;
    }
    setRightAscension(rightAscension) {
        this.properties.ra = rightAscension;
    }
    getDeclination() {
        return this.properties.dec;
    }
    setDeclination(declination) {
        this.properties.dec = declination;
    }
    getMagnitude() {
        return this.properties.magnitude;
    }
    setMagnitude(magnitude) {
        this.properties.magnitude = magnitude;
    }
    getType() {
        return this.properties.type;
    }
    setType(type) {
        this.properties.type = type;
    }
    // Spectra data arrays
    getWavelength() {
        return this.wavelength;
    }  
    setWavelength(wavelength) {
        this.wavelength = wavelength;
    }
    getIntensity() {
        return this.intensity;
    }  
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    getVariance() {
        return this.variance;
    }  
    setVariance(variance) {
        this.variance = variance;
    }
    getSky() {
        return this.sky;
    }  
    setSky(sky) {
        this.sky = sky;
    }
    getDoHelio() {
        return this.dohelio;
    }
    getDoCMB() {
        return this.docmb;
    }
    // Good enough method to tell if v is a dictionary or not
    isDict(v) {
        return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
    }
}
