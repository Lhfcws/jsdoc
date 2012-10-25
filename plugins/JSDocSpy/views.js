/*jslint  indent: 4, maxerr: 50, rhino: true, node: true, sloppy: true, white: true, stupid: true, plusplus: true */
/*global exports: true, env: true, */
/**
 * @file views used in generating docs from JSDoc 3 internals
 * @exports plugins/JSDocSpy/views
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 */

/** @function */
function gfmMarkdownToHtml(text) {
    var out, gfmParser;
    // this wants the gfm markdown parser regardless of conf.json settings
    gfmParser = require('jsdoc/util/markdown').getParser('gfm');
    out = gfmParser(text);
    return out;
}

/** @namespace */
exports.views = {
    /** @namespace */
    tagDictionary : {},
    /** @namespace */
    gfmMarkdown : {}
};

/** @function */
exports.views.gfmMarkdown.asHtml = function(text) {
    var out;
    out = gfmMarkdownToHtml(text);
    return out;
};

/** @function 
exports.views.tagDictionary.toHtml = function(obj) {
    var os, out, JSDocSpy;
    os = require('os');
    JSDocSpy = require('plugins/JSDocSpy/views');
    out = JSDocSpy.views.tagDictionary.toMarkdown(obj, false);
    out = out.map(function(entry) {
        return(gfmMarkdownToHtml(entry));
    });
    out = out.join(os.EOL + os.EOL);
    return out;
};*/

/** @function */
exports.views.tagDictionary.toConsole = function(obj) {
    var out;
    out = JSON.stringify(obj, null, '    ');
    return out;
};

/** @function */
exports.views.tagDictionary.toMarkdown = function(obj, generateFiles) {
    var EOL, os, fs, path, tag, thisTag, prop, val, tmp, out;
    os = require('os');
    EOL = os.EOL;
    if(generateFiles === true) {
        fs = require('fs');
        path = require('path');
    }
    out = [];
    for(tag in obj) {
        if(obj.hasOwnProperty(tag)) {
            thisTag = '';
            
            if(obj.hasOwnProperty(tag)) {
                thisTag += '## ' + tag + EOL;
                
                for(prop in obj[tag]) {
                    if(obj[tag].hasOwnProperty(prop)) {
                        thisTag += '*' + prop + '* : ';
                        val = obj[tag][prop];
                        tmp = val.toString().trim();
                        tmp = tmp.replace(/\r\n|\n|\r/g, os.EOL);
                        tmp = tmp.replace(/\t/g, '    ');
                        switch(typeof(val)) {
                            case 'function':
                                val = EOL + '```javascript' + os.EOL + tmp + os.EOL + '```';
                                break;
                            
                            case 'object':
                                val = tmp;
                                break;
                            
                            default:
                                val = tmp;
                                break;
                        }
                        thisTag += val + EOL;
                    }
                }
                
                thisTag += EOL;
                if(generateFiles === true) {
                    fs.mkPath(env.opts.destination);
                    fs.writeFileSync(path.join(env.opts.destination, 'tags-' + tag + '.gfmMarkdown') , thisTag, 'utf8');
                } else {
                    out.push(thisTag.trim());
                }
            }
        }
    }
    return out;
};


/** @function */
exports.views.tagDictionary.toHtml = function(obj, generateFiles) {
    var EOL, os, fs, path, tag, thisTag, prop, val, tmp, out;
    os = require('os');
    EOL = '<br>' + os.EOL;
    if(generateFiles === true) {
        fs = require('fs');
        path = require('path');
    }
    out = [];
    for(tag in obj) {
        if(obj.hasOwnProperty(tag)) {
            thisTag = '';
            
            if(obj.hasOwnProperty(tag)) {
                thisTag += '<h2>' + tag + '</h2>' + os.EOL;
                thisTag += '<p>' + EOL;
                for(prop in obj[tag]) {
                    if(obj[tag].hasOwnProperty(prop)) {
                        thisTag += '<b>' + prop + '</b> : ';
                        val = obj[tag][prop];
                        tmp = val.toString().trim();
                        tmp = tmp.replace(/\r\n|\n|\r/g, os.EOL);
                        tmp = tmp.replace(/\t/g, '    ');
                        switch(typeof(val)) {
                            case 'function':
                                val = EOL + '</p>' + os.EOL + '<pre class="prettyprint lang-js">';
                                val += os.EOL + tmp + os.EOL + '</pre>' + '<p>' + os.EOL;
                                break;
                            
                            case 'object':
                                val = tmp;
                                break;
                            
                            default:
                                val = tmp;
                                break;
                        }
                        thisTag += val + EOL;
                    }
                }
                
                thisTag += '</p>' + EOL;
                if(generateFiles === true) {
                    fs.mkPath(env.opts.destination);
                    fs.writeFileSync(path.join(env.opts.destination, 'tags-' + tag + '.html') , thisTag, 'utf8');
                } else {
                    out.push(thisTag.trim());
                }
            }
        }
    }
    return out;
};