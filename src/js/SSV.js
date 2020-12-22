/**
 * @description Simple Spectrum Viewer
 * @module ssv
 */
import { SpectrumX } from './spectrumX';
import { compile } from 'vega-lite';

/**
 * @description Simple Spectrum Viewer
 * @class module:ssv
 */
export class SSV {
    /**
     * SSV is a class to representing a Simple Spectrum Viewer
     * and generating charts for Vega Components.
     * @see https://vega.github.io/vega/
     *
     * @param {Text} name Name of the Simple Spectrum Viewer instance
     *
     * @constructor
     */
    constructor(name) {
        this.name = name;
        this.traces = {};
        this.tracesMins = {};
        this.tracesMaxs = {};
        this.tracesMinClips = {};
        this.tracesMaxClips = {};
        this.traces_visibility = {};
        this.traces_xoffset = {};
        this.traces_yoffset = {};
        this.traces_colour = {};

        this.xaxisTraceName = "x";
        this.xaxisTitle = "x";
        this.yaxisTraceName = "y";
        this.yaxisTitle = "y";

        this.z = 0;
        this.templates = []; // an Array of templateX objects
        this.activeTemplateId = "";
        this.activeTemplateData = [];
        this.activeTemplateRedshift = 0;
        this.activeTemplateYoffset = 0;
        this.z_fact = (1.0 + this.z) / (1.0 + this.activeTemplateRedshift);

        this.smooth_half_width = 0;


        this.pin = {};
        this.values = [];
        this.vrules = {};

        // plugins
        this.plugins = {};
        this.plugin_value = {};

        this.core = {
            'dropPin': (ssv, args) => setTimeout(() => {
                alert(args["message"]);
            }, 0),
            'loadSpectraLines': (ssv,args) => {
                return this.default_lines();
            },
            'loadTemplates': (ssv,args) => {
                return null;
            }
        };
    }

    /**
     * Register a plugin function
     * @method plugin_register
     * @param {any} plugin Name and function associated with the plugin
     *
     * @return None
     */
    plugin_register(plugin) {
        const { name, exec } = plugin;
        this.plugins[name] = exec;
    }

    /**
     * Apply the named plugin feature and stash the results for later retrieval
     * @param {*} feature - Name of the plugin
     * @param {*} args - arguments passed to the plugin function
     */
    plugin_apply(feature, args) {
        const func =  this.plugins[feature] || this.core[feature];
        this.plugin_setValue(feature,func(this, args));
    }
    plugin_setValue(feature, newVal) {
        this.plugin_value[feature] = newVal;
    }
    /**
     * Return current value associated with the named plugin feature
     * @param {String} feature 
     * @return {Object} - plugin dependent object
     */
    plugin_getValue(feature) {
        return this.plugin_value[feature];
    }

    /**
     * Inititialise this instance using predefined plugins
     */
    initialise() {
        console.log("ssv initialised");
        this.plugin_apply("loadSpectraLines", {"message":"loading"});
        this.plugin_apply("loadTemplates", {"message":"loading"});
        this.setTemplates(this.plugin_getValue["loadTemplates"]);
    }

    /**
     * @returns Name of this Simple Spectrum Viewer instance
     */
    getName() {
        return this.name;
    }

    /**
     * 
     * @param {String} name - The name of the trace
     * @param {Array} data - The trace data as an array of numbers
     */
    setTrace(name, data) {
        this.traces[name] = data;
        this.traces_visibility[name] = true;
        this.traces_xoffset[name] = 0;
        this.traces_yoffset[name] = 0;
        this.traces_colour[name] = "black";
        if (data.length>0) {
            let minvalue=9999999;
            let maxvalue=-9999999;
            for (let i=0; i < data.length; i++) {
                if (!isNaN(data[i])) {
                    if (data[i]>maxvalue) {
                        maxvalue = data[i];
                    }
                    if (data[i]<minvalue) {
                        minvalue = data[i];
                    }
                }
            }
            this.tracesMins[name] = minvalue;
            this.tracesMaxs[name] = maxvalue;
            this.tracesMinClips[name] = minvalue;
            this.tracesMaxClips[name] = maxvalue;

            console.log("INIT TRACE",name,minvalue,maxvalue);
        }
    }

    /**
     * Get data associated with a named trace
     *
     * @param {String} name The name of the trace
     *
     * @returns The data associated with trace "name"
     */
    getTrace(name) {
        return this.traces[name];
    }

    getTraceMin(name) {
        return this.tracesMins[name];
    }
    getTraceMax(name) {
        return this.tracesMaxs[name];
    }

    setTraceMinClip(name, minclip) {
        console.log("SET TRACE MIN CLIP",name,minclip)
        this.tracesMinClips[name] = minclip;
    }

    setTraceMaxClip(name, maxclip) {
        this.tracesMaxClips[name] = maxclip;
    }

    getTraceMinClip(name) {
        return this.tracesMinClips[name];
    }

    getTraceMaxClip(name) {
        return this.tracesMaxClips[name];
    }

    /**
     * Set the visibility of the named trace
     * @param {String} name 
     * @param {boolean} is_visible 
     */
    setTraceVisibility(name, is_visible) {
        this.traces_visibility[name] = is_visible;
    }

    getTraceVisibility(name) {
        return this.traces_visibility[name];
    }
    
    setTraceXOffset(name, xoffset) {
        this.traces_xoffset[name] = xoffset;
    }
    
    setTraceYOffset(name, yoffset) {
        this.traces_yoffset[name] = yoffset
    }

    /**
     * Set the colour of the named trace
     * @param {String} name - Trace name
     * @param {String} colour - Colour name
     */
    setTraceColour(name,colour) {
        this.traces_colour[name] = colour;
    }
    
    addPin(name, x, y) {
        console.log("ADD PIN",x,y)
        this.pin["x"] = x;
        this.pin["y"] = y;
    }
    getPinX(name) {
        if ("x" in this.pin) {
            return this.pin["x"];
        } else {
            return 0.0;
        }
    }

    setVRule(name, x) {
        this.vrules[name] = x;
    }

    addHRule(name, y) {
        //print("addHRule")
        //pass
    }

    setXAxisTitle(name, title) {
        //print("setXAxisTitle")
        this.xaxisTraceName = name
        this.xaxisTitle = title
    }
    
    setYAxisTitle(name, title) {
        //print("setYAxisTitle")
        this.yaxisTraceName = name
        this.yaxisTitle = title
    }

    setActiveTemplate(id,data,z) {
        this.activeTemplateId = id;
        this.activeTemplateData = data;
        this.activeTemplateRedshift = z;
    }

    getActiveTemplateId() {
        return this.activeTemplateId;
    }

    setTemplates(templates) {
        this.templates = templates;
    }

    setRedshift(z) {
        this.z = z;
        this.z_fact = (1.0 + this.z) / (1.0 + this.activeTemplateRedshift);
    }

    setSmoothHalfWidth(half_width) {
        this.smooth_half_width = half_width;
    }

    setActiveTemplateYOffset(yoffset) {
        this.activeTemplateYoffset = yoffset;
    }

    getTemplates() {
        return this.templates;
    }

    getTemplateIds() {
        let result = [];
        for (let i=0;i<this.templates.length;i++) {
            result.push(this.templates[i].id);
        }
        return result;
    }

    getTemplateNames() {
        let result = [];
        for (let i=0;i<this.templates.length;i++) {
            result.push(this.templates[i].name);
        }
        return result;
    }

    getTemplateFortId(id) {
        for (let i=0;i<this.templates.length;i++) {
            if (this.templates[i].id == id) {
                return this.templates[i];
            }
        }
    }

    getTemplateForName(name) {
        for (let i=0;i<this.templates.length;i++) {
            if (this.templates[i].name == name) {
                return this.templates[i];
            }
        }
    }

    /*
     * End of getters/setters
     */
    
    default_lines() {
        let result=
        {
            "name": [
                'Lyβ',
                'Lyα',
                '[NV]',
                'Si4',
                'CIV',
                'CIII',
                'MgII',
                '[OII]',
                '[NeIII]',
                'K',
                'H',
                'Hδ',
                'G-band',
                'Hγ',
                'Hβ',
                '[OIII]',
                '[OIII]',
                'Mg',
                'Na',
                '[NII]',
                'Hα',
                '[NII]',
                '[SII]',
                '[SII]',
            ],
            "wavelength": [
                102.5722,
                121.5670,
                124.014,
                140.00,
                154.906,
                190.873,
                279.875,
                372.8485,
                386.981,
                393.3663,
                396.8468,
                410.292,
                430.44,
                434.169,
                486.1325,
                495.8911,
                500.6843,
                517.53,
                589.40,
                654.984,
                656.280,
                658.523,
                671.832,
                673.271,
            ],
        };
        return result;
    }

    /**
     * Load JSON format Marz spectrum data
     * @param {Dict} json 
     * @param {Object} ssv - An SSV instance
     */
    readJSON(json,ssv) {
        console.log("readJSON");
        const dict = json;
        const spectrumx = new SpectrumX('1');
        spectrumx.fromDictionary(dict);
        ssv.setTrace('intensity', spectrumx.getIntensity());
        ssv.setTrace('variance', spectrumx.getVariance());
        ssv.setTrace('sky', spectrumx.getSky());
        ssv.setTrace('wavelength', spectrumx.getWavelength());
        ssv.setTraceColour('intensity', 'green');
        ssv.setTraceColour('variance', 'orange');
        ssv.setTraceColour('sky', 'lightblue');
        ssv.setTraceVisibility("variance",false);
        ssv.setXAxisTitle('wavelength', 'Wavelength');
        ssv.setYAxisTitle('intensity', 'Intensity');
    }

    /**
     * Generate data array snippets for efficent insertion into Vega schema
     */
    prepareDataForVegaSpec() {
        console.log("prepareDataForVegaSpec")
        const x = this.getTrace(this.xaxisTraceName);
        const y = this.getTrace(this.yaxisTraceName);
        const values = this.values;
        values.length = 0;
        for (let i=0; i < x.length; i++) {
            if (!isNaN(x[i])) {
                let value = {};
                value[this.xaxisTraceName] = x[i];
                value[this.yaxisTraceName] = y[i];
                for (var key in this.traces) {
                    if (key==this.xaxisTraceName) continue;
                    if (key==this.yaxisTraceName) continue;
                    value[key] = this.getTrace(key)[i];
                }
                values.push(value);
            }
        }
    }
    /**
     * Produce Marz Simple Spectrum View chart
     * 
     * @param {integer} width 
     * @param {integer} height 
     * @param {Number} minx 
     * @param {Number} maxx 
     * @param {Number} miny 
     * @param {Number} maxy 
     * @param {boolean} axis_labels 
     * @param {boolean} secondary_traces 
     * 
     * @returns vega schema as json
     */
    getVegaSpec(width, height, minx, maxx, miny, maxy, axis_labels=true, secondary_traces=true) {
        const x = this.getTrace(this.xaxisTraceName);
        const y = this.getTrace(this.yaxisTraceName);
        const minclipx = minx;
        const maxclipx = maxx;
        const minclipy = miny;
        const maxclipy = maxy;
        const values = this.values;
        // basic layout
        const yaxis_keyword = "range";
        const yaxis_constraint = [minclipy, maxclipy];
        const yaxis_label_keyword = "axis";
        const yaxis_label = {"title": this.yaxisTitle};
        const xaxis_label_keyword = "axis";
        const xaxis_label = {"title": this.xaxisTitle};
        if (!axis_labels) {
            xaxis_label.title = "";
            yaxis_label.title = "";
        }

        
        const result = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
        "config": {
            "view": {
                "continuousHeight": height,
                "continuousWidth": width
            }
        },
        "data": {
            "name": "spectrum",
            "values": values
        },
        "encoding": {"x": {"field": this.xaxisTraceName, "type": "quantitative"}},
        "transform": [
            {"calculate": "-datum.variance/30.0 + "+maxclipy, "as": "variance2"}
          ],
        "signals": [
            {
              "name": "templateOffset",
              "value": this.activeTemplateYoffset
            },
            {
                "name": "redshift",
                "value": this.z_fact
              }
          ],
        "layer": []
        };
        // Primary trace
        //
        //"x": {"field": this.xaxisTraceName, "type": "quantitative"},
        const spectrumline={
            "mark": "line",
            "transform":[],
            "encoding": {
                "y": {"field": "intensityT", "type": "quantitative"},
                "color": {"value": "green"},
                "size": {"value": 0.4}
            }
        };
        spectrumline["transform"].push({"filter": {"field": this.xaxisTraceName, "range": [minclipx, maxclipx]}});
        spectrumline["transform"].push({
            "window": [{"op": "mean", "field": this.yaxisTraceName, "as": "intensityT"}],
            "frame": [-this.smooth_half_width, this.smooth_half_width]
          });
        spectrumline["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
        spectrumline["encoding"]["y"][yaxis_label_keyword] = yaxis_label;
        // For pan and zoom
        spectrumline["selection"] = {
            "grid": {
                "type": "interval", "bind": "scales"
            }
        };
        result["layer"].push(spectrumline);

        // Overlay traces
        if (secondary_traces) {
            for (var key in this.traces) {
                if (key==this.xaxisTraceName) continue;
                if (key==this.yaxisTraceName) continue;

                const xoffset = this.traces_xoffset[key];
                const yoffset = this.traces_yoffset[key];
                let xkey = this.xaxisTraceName;
                if (xoffset != 0) {
                    xkey += "T";
                }
                let ykey = key;
                if (yoffset != 0) {
                    ykey += "T";
                }
                const aline={
                    "name": "secondary"+key,
                    "mark": "line",
                    "transform": [{"filter": {"field": key, "range": [minclipy, maxclipy]}}],
                    "encoding": {
                        "y": {"field": ykey, "type": "quantitative"},
                        "x": {"field": xkey, "type": "quantitative"},
                        "color": {"value": this.traces_colour[key]},
                        "size": {"value": 0.4}
                    }
                };
                if (xoffset != 0) {
                    aline["transform"].push({"calculate": "datum." + this.xaxisTraceName + " + "+xoffset, "as": xkey});
                }
                if (yoffset != 0) {
                    aline["transform"].push({"calculate": "datum." + key + " + "+yoffset, "as": ykey});
                }
                aline["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
                aline["encoding"]["y"][yaxis_label_keyword] = yaxis_label;
                aline["encoding"]["y"]["scale"] = {"domain":yaxis_constraint};
                if (this.getTraceVisibility(key)) {
                    result["layer"].push(aline);
                }
            }
        }
         
         // Best fit Template overlay
        if (this.activeTemplateId!="") {
            const specvalues=[];
            const specx=this.activeTemplateData[0];
            const specy=this.activeTemplateData[1];
            let minvalue_spectrum = 9999999;
            let maxvalue_spectrum = -9999999;
            for (let i=0; i < x.length; i++) {
                if (!isNaN(y[i])) {
                    if (x[i]<minclipx || x[i]>maxclipx)
                        continue;
                    if (y[i]>maxvalue_spectrum) {
                        maxvalue_spectrum = y[i];
                    }
                    if (y[i]<minvalue_spectrum) {
                        minvalue_spectrum = y[i];
                    }
                }
            }
            let minvalue=9999999;
            let maxvalue=-9999999;
            for (let i=0; i < specy.length; i++) {
                if (!isNaN(specy[i])) {
                    if (specx[i]*this.z_fact<minclipx || specx[i]*this.z_fact>maxclipx)
                        continue;
                    if (specy[i]>maxvalue) {
                        maxvalue = specy[i];
                    }
                    if (specy[i]<minvalue) {
                        minvalue = specy[i];
                    }
                }
            }
            const sf=(maxvalue_spectrum-minvalue_spectrum)/(maxvalue-minvalue);
            for (let j=0; j < specx.length; j++) {
                if (!isNaN(specy[j])) {
                    let value = {"wavelength":specx[j], "intensity":(specy[j]-minvalue)*sf+minclipy};
                    specvalues.push(value);
                }
            }
            const key = "intensity";
            const wavelength_key = "wavelengthT";
            let ykey = key+"T";
            const aline={
                "data": {
                        "values":specvalues
                },
                "transform": [],
                "mark": "line",
                "encoding": {
                    "y": {"field": ykey, "type": "quantitative"},
                    "x": {"field": wavelength_key, "type": "quantitative"},
                    "color":{"value":"brown"},
                    "size": {"value": 0.4}
                }
            };
            aline["transform"].push({"calculate": "datum.wavelength * redshift", "as": wavelength_key});
            aline["transform"].push({"calculate": "datum." + key + " + templateOffset*10.0", "as": ykey});
            aline["transform"].push({"filter": {"field": wavelength_key, "range": [minclipx, maxclipx]}});
            aline["encoding"]["x"][xaxis_label_keyword] = xaxis_label;
            result["layer"].push(aline);
        }
        // Add spectral lines
        const lines = this.plugin_getValue("loadSpectraLines");
        const lvalues = [];
        for (let i=0;i<lines["name"].length;i++) {
            const wavelength=lines["wavelength"][i]*10.0;
            const name=lines["name"][i];
            let value = {"wavelength": wavelength, "label": name};
            lvalues.push(value);
        }
       
        const wavelength_key = "wavelengthT";
        const aline={
            "data": {
                    "values": lvalues
            },
            "transform": [],
            "mark": "rule",
            "encoding": {
                "x": {"field": wavelength_key ,"type":"quantitative"},
                "strokeDash": {"value":[16, 16]},
                "color": {"value":"blue"},
                "size": {"value": 1},
                "opacity": {"value":10}
            },
        };
        aline["transform"].push({"calculate": "datum.wavelength * redshift", "as": wavelength_key});
        aline["transform"].push({"filter": {"field": wavelength_key, "range": [minclipx, maxclipx]}});
        result["layer"].push(aline);
        const aname={
            "data": {
                "values": lvalues
            },
            "transform": [],
            "mark": {
                "type":"text",
                "clip": false,
                "font":"monospace",
                "fontSize":20,
                "fontWeight":"normal",
                "baseline": "bottom"
            },
            "encoding":{
                "x":{"field": wavelength_key ,"type":"quantitative"},
                "y":{"value":0},
                "text":{"field": "label"}
            }
        };
        aname["transform"].push({"calculate": "datum.wavelength * redshift", "as": wavelength_key});
        aname["transform"].push({"filter": {"field": wavelength_key, "range": [minclipx, maxclipx]}});
        result["layer"].push(aname);
                
        if (this.pin["x"]) {
            const circleA={
                "data": {
                        "values":{"wavelength": this.pin["x"], "intensity": this.pin["y"]}
                },
                "transform": [{"filter": {"field": "wavelength", "range": [minclipx, maxclipx]}}],
                "mark": {
                        "type":"point"
                },
                "encoding":{
                        "x":{"field": "wavelength" ,"type":"quantitative"},
                        "y":{"field": "intensity" ,"type":"quantitative"},
                        "shape":{"value":"circle"},
                        "size": {"value": 15},
                        "color": {"value": "purple"}
                }
            };
            const circleB={
                "data": {
                        "values":{"wavelength": this.pin["x"], "intensity": this.pin["y"]}
                },
                "transform": [{"filter": {"field": "wavelength", "range": [minclipx, maxclipx]}}],
                "mark": {
                        "type":"point"
                },
                "encoding":{
                        "x":{"field": "wavelength" ,"type":"quantitative"},
                        "y":{"field": "intensity" ,"type":"quantitative"},
                        "shape":{"value":"circle"},
                        "size": {"value": 120},
                        "color": {"value": "purple"}
                }
            };
            result["layer"].push(circleA);
            result["layer"].push(circleB);
        }
        const compiled=compile(result);
        // search for y axis in scales
        compiled["spec"]["signals"].push({
            "name": "templateOffset",
            "value": this.activeTemplateYoffset
        });
        compiled["spec"]["signals"].push({
            "name": "redshift",
            "value": this.z_fact
        });
        return compiled["spec"];
    }
    /**
     * Produce simple Marz crosscorrelation chart
     * 
     * @returns Vega chart schema as json
     */
    getGeneralVegaSpec() {
        const x = this.getTrace(this.xaxisTraceName);
        const y = this.getTrace(this.yaxisTraceName);
        const minclipx = this.getTraceMin(this.xaxisTraceName);
        const maxclipx = this.getTraceMax(this.xaxisTraceName);
        const minclipy = this.getTraceMinClip(this.yaxisTraceName);
        const maxclipy = this.getTraceMaxClip(this.yaxisTraceName);
        const values = [];
        for (let i=0; i < x.length; i++) {
            if (!isNaN(x[i])) {
                let value = {};
                value[this.xaxisTraceName] = x[i];
                value[this.yaxisTraceName] = y[i];
                for (var key in this.traces) {
                    if (key==this.xaxisTraceName) continue;
                    if (key==this.yaxisTraceName) continue;
                    value[key] = this.getTrace(key)[i];
                }
                values.push(value);
            }
        }
        // basic layout
        const yaxis_keyword = "range";
        const yaxis_constraint = [minclipy, maxclipy];
        
        const result = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
        "config": {
            "view": {
                "continuousHeight": 100,
                "continuousWidth": 1500
            }
        },
        "data": {
            "name": "spectrum",
            "values": values
        },
        "encoding": {"x": {"field": this.xaxisTraceName, "type": "quantitative", "axis":""}},
        "signals": [
            {
                "name": "redshift",
                "value": this.z
            },
            {
                "name": "xcorlabel",
                "value": "starting"
            },
          ],
        "layer": []
        };
        // Primary trace
        //
        //"x": {"field": this.xaxisTraceName, "type": "quantitative"},
        const spectrumline={
            "mark": "line",
            "transform":[],
            "encoding": {
                "y": {"field": this.yaxisTraceName, "type": "quantitative"},
                "color": {"value": "green"},
                "size": {"value": 0.4},
                "tooltip": {"field": this.yaxisTraceName , "type": "quantitative"}
            }
        };
        spectrumline["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
        spectrumline["encoding"]["y"]["axis"] = "";
        result["layer"].push(spectrumline);


        const xcorlabel=''+this.z;

        for (var key in this.vrules) {
            const aline={
                "data": {
                        "values": [{"zs": 0.0}]
                },
                "transform": [],
                "mark": "rule",
                "encoding": {
                        "x": {"field": "zsT", "type":"quantitative"},
                        "strokeDash": {"value":[16, 16]},
                        "color": {"value":"blue"},
                        "size": {"value": 1}
                },
            };
            aline["transform"].push({"calculate": "datum.zs + redshift", "as": "zsT"});
            aline["transform"].push({"filter": {"field": "zsT", "range": [minclipx, maxclipx]}});
            //aline["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
            //aline["encoding"]["y"][yaxis_label_keyword] = "";
            result["layer"].push(aline);

            const aname={
                "data": {
                    "values": [{"zs": 0.0, "xcor": 0.0}]
                },
                "transform": [],
                "mark": {
                        "type":"text"
                },
                "encoding":{
                    "x": {"field": "zsT", "type":"quantitative"},
                    "y":{"value":0},
                    "text":{"value": xcorlabel}
                }
            };
            aname["transform"].push({"calculate": "datum.zs + redshift", "as": "zsT"});
            aname["transform"].push({"filter": {"field": "zsT", "range": [minclipx, maxclipx]}});
            //aname["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
            //aname["encoding"]["y"][yaxis_label_keyword] = "";
            result["layer"].push(aname);
        }
        const compiled=compile(result);
        compiled["spec"]["signals"] = [];
        compiled["spec"]["signals"].push({
            "name": "redshift",
            "value": this.z
        });
        compiled["spec"]["signals"].push({
            "name": "xcorlabel",
            "value": xcorlabel
        });
        return compiled["spec"];
    }
    /**
     * Produce Marz callout chart 
     * @param {integer} width 
     * @param {integer} height 
     * @param {Number} minx 
     * @param {Number} maxx 
     * @param {boolean} secondary_traces 
     */
    getCalloutVegaSpec(width, height, minx, maxx, secondary_traces=true) {

        const x = this.getTrace(this.xaxisTraceName);
        const y = this.getTrace(this.yaxisTraceName);
        const minclipx = minx;
        const maxclipx = maxx;
        const minclipy = this.getTraceMin(this.yaxisTraceName);
        const maxclipy = this.getTraceMax(this.yaxisTraceName);
        const values = this.values;
        
        // basic layout
        const yaxis_keyword = "range";
        const yaxis_constraint = [minclipy, maxclipy];
        const yaxis_label_keyword = "axis";
        const yaxis_label = {"title": this.yaxisTitle};

        
        const result = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
        "config": {
            "view": {
                "continuousHeight": height,
                "continuousWidth": width
            }
        },
        "data": {
            "name": "spectrum",
            "values": values
        },
        "encoding": {"x": {"field": this.xaxisTraceName, "type": "quantitative"}},
        "transform": [
            {"calculate": "-datum.variance/30.0 + "+maxclipy, "as": "variance2"}
          ],
        "signals": [
            {
              "name": "templateOffset",
              "value": this.activeTemplateYoffset
            },
            {
                "name": "redshift",
                "value": this.z_fact
              }
          ],
        "layer": []
        };
        // Primary trace
        //
        //"x": {"field": this.xaxisTraceName, "type": "quantitative"},
        const spectrumline={
            "mark": "line",
            "transform":[],
            "encoding": {
                "y": {"field": "intensityT", "type": "quantitative"},
                "color": {"value": "green"},
                "size": {"value": 0.4}
            }
        };
        spectrumline["transform"].push({"filter": {"field": this.xaxisTraceName, "range": [minclipx, maxclipx]}});
        spectrumline["transform"].push({
            "window": [{"op": "mean", "field": this.yaxisTraceName, "as": "intensityT"}],
            "frame": [-this.smooth_half_width, this.smooth_half_width]
          });
        spectrumline["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
        spectrumline["encoding"]["y"][yaxis_label_keyword] = yaxis_label;
        // For pan and zoom
        spectrumline["selection"] = {
            "grid": {
                "type": "interval", "bind": "scales"
            }
        };
        result["layer"].push(spectrumline);

        // Overlay traces
        if (secondary_traces) {
            for (var key in this.traces) {
                if (key==this.xaxisTraceName) continue;
                if (key==this.yaxisTraceName) continue;

                const xoffset = this.traces_xoffset[key];
                const yoffset = this.traces_yoffset[key];
                let xkey = this.xaxisTraceName;
                if (xoffset != 0) {
                    xkey += "T";
                }
                let ykey = key;
                if (yoffset != 0) {
                    ykey += "T";
                }
                const aline={
                    "mark": "line",
                    "transform": [{"filter": {"field": key, "range": [minclipy, maxclipy]}}],
                    "encoding": {
                        "y": {"field": ykey, "type": "quantitative"},
                        "x": {"field": xkey, "type": "quantitative"},
                        "color": {"value": this.traces_colour[key]},
                        "size": {"value": 0.4}
                    }
                };
                if (xoffset != 0) {
                    aline["transform"].push({"calculate": "datum." + this.xaxisTraceName + " + "+xoffset, "as": xkey});
                }
                if (yoffset != 0) {
                    aline["transform"].push({"calculate": "datum." + key + " + "+yoffset, "as": ykey});
                }
                aline["encoding"]["y"][yaxis_keyword] = yaxis_constraint;
                aline["encoding"]["y"][yaxis_label_keyword] = yaxis_label;
                if (this.getTraceVisibility(key)) {
                    result["layer"].push(aline);
                }
            }
        }
         
         // Best fit Template overlay
        if (this.activeTemplateId!="") {
            const xaxis_label_keyword = "axis";
            const xaxis_label = {"title": this.xaxisTitle};
            const specvalues=[];
            const specx=this.activeTemplateData[0];
            const specy=this.activeTemplateData[1];
                let minvalue=9999999;
                let maxvalue=-9999999;
                for (let i=0; i < specy.length; i++) {
                    if (!isNaN(specy[i])) {
                        if (specx[i]*this.z_fact<minclipx || specx[i]*this.z_fact>maxclipx)
                            continue;
                        if (specy[i]>maxvalue) {
                            maxvalue = specy[i];
                        }
                        if (specy[i]<minvalue) {
                            minvalue = specy[i];
                        }
                    }
                }
            const sf=(maxclipy-minclipy)/(maxvalue-minvalue);
            for (let j=0; j < specx.length; j++) {
                if (!isNaN(specy[j])) {
                    let value = {"wavelength":specx[j], "intensity":(specy[j]-minvalue)*sf+minclipy};
                    specvalues.push(value);
                }
            }
            const key = "intensity";
            const wavelength_key = "wavelengthT";
            let ykey = key+"T";
            const aline={
                "data": {
                        "values":specvalues
                },
                "transform": [],
                "mark": "line",
                "encoding": {
                    "y": {"field": ykey, "type": "quantitative"},
                    "x": {"field": wavelength_key, "type": "quantitative"},
                    "color":{"value":"brown"},
                    "size": {"value": 0.4}
                }
            };
            aline["transform"].push({"calculate": "datum.wavelength * redshift", "as": wavelength_key});
            aline["transform"].push({"calculate": "datum." + key + " + templateOffset*10.0", "as": ykey});
            aline["transform"].push({"filter": {"field": wavelength_key, "range": [minclipx, maxclipx]}});
            aline["encoding"]["x"][xaxis_label_keyword] = xaxis_label;
            result["layer"].push(aline);
        }
        // Add spectral lines
        const lines = this.plugin_getValue("loadSpectraLines");
        const lvalues = [];
        for (let i=0;i<lines["name"].length;i++) {
            const wavelength=lines["wavelength"][i]*10.0;
            const name=lines["name"][i];
            let value = {"wavelength": wavelength, "label": name};
            lvalues.push(value);
        }
       
        const wavelength_key = "wavelengthT";
        const aline={
            "data": {
                    "values": lvalues
            },
            "transform": [],
            "mark": "rule",
            "encoding": {
                "x": {"field": wavelength_key ,"type":"quantitative"},
                "strokeDash": {"value":[16, 16]},
                "color": {"value":"blue"},
                "size": {"value": 1}
            },
        };
        aline["transform"].push({"calculate": "datum.wavelength * redshift", "as": wavelength_key});
        aline["transform"].push({"filter": {"field": wavelength_key, "range": [minclipx, maxclipx]}});
        result["layer"].push(aline);
        const aname={
            "data": {
                "values": lvalues
            },
            "transform": [],
            "mark": {
                "type":"text"
            },
            "encoding":{
                "x":{"field": wavelength_key ,"type":"quantitative"},
                "y":{"value":0},
                "text":{"field": "label"}
            }
        };
        aname["transform"].push({"calculate": "datum.wavelength * redshift", "as": wavelength_key});
        aname["transform"].push({"filter": {"field": wavelength_key, "range": [minclipx, maxclipx]}});
        result["layer"].push(aname);
                
        if (this.pin["x"]) {
            const circleA={
                "data": {
                        "values":{"wavelength": this.pin["x"], "intensity": this.pin["y"]}
                },
                "transform": [{"filter": {"field": "wavelength", "range": [minclipx, maxclipx]}}],
                "mark": {
                        "type":"point"
                },
                "encoding":{
                        "x":{"field": "wavelength" ,"type":"quantitative"},
                        "y":{"field": "intensity" ,"type":"quantitative"},
                        "shape":{"value":"circle"},
                        "size": {"value": 15},
                        "color": {"value": "purple"}
                }
            };
            const circleB={
                "data": {
                        "values":{"wavelength": this.pin["x"], "intensity": this.pin["y"]}
                },
                "transform": [{"filter": {"field": "wavelength", "range": [minclipx, maxclipx]}}],
                "mark": {
                        "type":"point"
                },
                "encoding":{
                        "x":{"field": "wavelength" ,"type":"quantitative"},
                        "y":{"field": "intensity" ,"type":"quantitative"},
                        "shape":{"value":"circle"},
                        "size": {"value": 120},
                        "color": {"value": "purple"}
                }
            };
            result["layer"].push(circleA);
            result["layer"].push(circleB);
        }
        const compiled=compile(result);
        compiled["spec"]["signals"].push({
            "name": "templateOffset",
            "value": this.activeTemplateYoffset
        });
        compiled["spec"]["signals"].push({
            "name": "redshift",
            "value": this.z_fact
        });
        return compiled["spec"];
    }
}
