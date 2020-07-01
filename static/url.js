/* Blob.js
 * A Blob, File, FileReader & URL implementation.
 * 2019-04-30
 *
 * By Eli Grey, http://eligrey.com
 * By Jimmy Wärting, https://github.com/jimmywarting
 * License: MIT
 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
 */

(function(global) {
	(function (factory) {
		if (typeof define === "function" && define.amd) {
			// AMD. Register as an anonymous module.
			define(["exports"], factory);
		} else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
			// CommonJS
			factory(exports);
		} else {
			// Browser globals
			factory(global);
		}
	})(function (exports) {
		"use strict";
	console.log("blob.js")

		var BlobBuilder = global.BlobBuilder
			|| global.WebKitBlobBuilder
			|| global.MSBlobBuilder
			|| global.MozBlobBuilder;

		var URL = global.URL || global.webkitURL || function (href, a) {
			a = document.createElement("a");
			a.href = href;
			return a;
		};

		var origBlob = global.Blob;
		var createObjectURL = URL.createObjectURL;
		var revokeObjectURL = URL.revokeObjectURL;
		var strTag = global.Symbol && global.Symbol.toStringTag;
		var blobSupported = false;
		var blobSupportsArrayBufferView = false;
		var arrayBufferSupported = !!global.ArrayBuffer;
		var blobBuilderSupported = BlobBuilder
			&& BlobBuilder.prototype.append
			&& BlobBuilder.prototype.getBlob;

		try {
			
		} catch (e) {/**/}


		// Helper function that maps ArrayBufferViews to ArrayBuffers
		// Used by BlobBuilder constructor and old browsers that didn't
		// support it in the Blob constructor.
		function mapArrayBufferViews (ary) {
			return ary.map(function (chunk) {
				if (chunk.buffer instanceof ArrayBuffer) {
					var buf = chunk.buffer;

					// if this is a subarray, make a copy so we only
					// include the subarray region from the underlying buffer
					if (chunk.byteLength !== buf.byteLength) {
						var copy = new Uint8Array(chunk.byteLength);
						copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
						buf = copy.buffer;
					}

					return buf;
				}

				return chunk;
			});
		}

		function BlobBuilderConstructor (ary, options) {
			options = options || {};

			var bb = new BlobBuilder();
			mapArrayBufferViews(ary).forEach(function (part) {
				bb.append(part);
			});

			return options.type ? bb.getBlob(options.type) : bb.getBlob();
		}

		function BlobConstructor (ary, options) {
			return new origBlob(mapArrayBufferViews(ary), options || {});
		}

		if (global.Blob) {
			BlobBuilderConstructor.prototype = Blob.prototype;
			BlobConstructor.prototype = Blob.prototype;
		}

		/********************************************************/
		/*               String Encoder fallback                */
		/********************************************************/
		function stringEncode (string) {
			var pos = 0;
			var len = string.length;
			var Arr = global.Uint8Array || Array; // Use byte array when possible

			var at = 0; // output position
			var tlen = Math.max(32, len + (len >> 1) + 7); // 1.5x size
			var target = new Arr((tlen >> 3) << 3); // ... but at 8 byte offset

			while (pos < len) {
				var value = string.charCodeAt(pos++);
				if (value >= 0xd800 && value <= 0xdbff) {
					// high surrogate
					if (pos < len) {
						var extra = string.charCodeAt(pos);
						if ((extra & 0xfc00) === 0xdc00) {
							++pos;
							value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
						}
					}
					if (value >= 0xd800 && value <= 0xdbff) {
						continue; // drop lone surrogate
					}
				}

				// expand the buffer if we couldn't write 4 bytes
				if (at + 4 > target.length) {
					tlen += 8; // minimum extra
					tlen *= (1.0 + (pos / string.length) * 2); // take 2x the remaining
					tlen = (tlen >> 3) << 3; // 8 byte offset

					var update = new Uint8Array(tlen);
					update.set(target);
					target = update;
				}

				if ((value & 0xffffff80) === 0) { // 1-byte
					target[at++] = value; // ASCII
					continue;
				} else if ((value & 0xfffff800) === 0) { // 2-byte
					target[at++] = ((value >> 6) & 0x1f) | 0xc0;
				} else if ((value & 0xffff0000) === 0) { // 3-byte
					target[at++] = ((value >> 12) & 0x0f) | 0xe0;
					target[at++] = ((value >> 6) & 0x3f) | 0x80;
				} else if ((value & 0xffe00000) === 0) { // 4-byte
					target[at++] = ((value >> 18) & 0x07) | 0xf0;
					target[at++] = ((value >> 12) & 0x3f) | 0x80;
					target[at++] = ((value >> 6) & 0x3f) | 0x80;
				} else {
					// FIXME: do we care
					continue;
				}

				target[at++] = (value & 0x3f) | 0x80;
			}
			console.log(target)
global.Uint8Array.prototype.slice = Array.prototype.slice
			console.log("give Uint8Array proper slice functionality");
			console.log(global.Uint8Array.prototype.slice, Array.prototype.slice);
			return target.slice(0, at);
		}

		/********************************************************/
		/*               String Decoder fallback                */
		/********************************************************/
		function stringDecode (buf) {
			var end = buf.length;
			var res = [];

			var i = 0;
			while (i < end) {
				var firstByte = buf[i];
				var codePoint = null;
				var bytesPerSequence = (firstByte > 0xEF) ? 4
					: (firstByte > 0xDF) ? 3
						: (firstByte > 0xBF) ? 2
							: 1;

				if (i + bytesPerSequence <= end) {
					var secondByte, thirdByte, fourthByte, tempCodePoint;

					switch (bytesPerSequence) {
					case 1:
						if (firstByte < 0x80) {
							codePoint = firstByte;
						}
						break;
					case 2:
						secondByte = buf[i + 1];
						if ((secondByte & 0xC0) === 0x80) {
							tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
							if (tempCodePoint > 0x7F) {
								codePoint = tempCodePoint;
							}
						}
						break;
					case 3:
						secondByte = buf[i + 1];
						thirdByte = buf[i + 2];
						if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
							tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
							if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
								codePoint = tempCodePoint;
							}
						}
						break;
					case 4:
						secondByte = buf[i + 1];
						thirdByte = buf[i + 2];
						fourthByte = buf[i + 3];
						if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
							tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
							if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
								codePoint = tempCodePoint;
							}
						}
					}
				}

				if (codePoint === null) {
					// we did not generate a valid codePoint so insert a
					// replacement char (U+FFFD) and advance only 1 byte
					codePoint = 0xFFFD;
					bytesPerSequence = 1;
				} else if (codePoint > 0xFFFF) {
					// encode to utf16 (surrogate pair dance)
					codePoint -= 0x10000;
					res.push(codePoint >>> 10 & 0x3FF | 0xD800);
					codePoint = 0xDC00 | codePoint & 0x3FF;
				}

				res.push(codePoint);
				i += bytesPerSequence;
			}

			var len = res.length;
			var str = "";
			var j = 0;

			while (j < len) {
				str += String.fromCharCode.apply(String, res.slice(j, j += 0x1000));
			}

			return str;
		}

		// string -> buffer
		var textEncode = typeof TextEncoder === "function"
			? TextEncoder.prototype.encode.bind(new TextEncoder())
			: stringEncode;

		// buffer -> string
		var textDecode = typeof TextDecoder === "function"
			? TextDecoder.prototype.decode.bind(new TextDecoder())
			: stringDecode;

		function FakeBlobBuilder () {
			function isDataView (obj) {
				return obj && Object.prototype.isPrototypeOf.call(DataView, obj);
			}
			function bufferClone (buf) {
				var view = new Array(buf.byteLength);
				var array = new Uint8Array(buf);
				var i = view.length;
				while (i--) {
					view[i] = array[i];
				}
				return view;
			}
			function array2base64 (input) {
				var byteToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

				var output = [];

				for (var i = 0; i < input.length; i += 3) {
					var byte1 = input[i];
					var haveByte2 = i + 1 < input.length;
					var byte2 = haveByte2 ? input[i + 1] : 0;
					var haveByte3 = i + 2 < input.length;
					var byte3 = haveByte3 ? input[i + 2] : 0;

					var outByte1 = byte1 >> 2;
					var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
					var outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
					var outByte4 = byte3 & 0x3F;

					if (!haveByte3) {
						outByte4 = 64;

						if (!haveByte2) {
							outByte3 = 64;
						}
					}

					output.push(
						byteToCharMap[outByte1], byteToCharMap[outByte2],
						byteToCharMap[outByte3], byteToCharMap[outByte4]
					);
				}

				return output.join("");
			}

			var create = Object.create || function (a) {
				function c () {}
				c.prototype = a;
				return new c();
			};

			if (arrayBufferSupported) {
				var viewClasses = [
					"[object Int8Array]",
					"[object Uint8Array]",
					"[object Uint8ClampedArray]",
					"[object Int16Array]",
					"[object Uint16Array]",
					"[object Int32Array]",
					"[object Uint32Array]",
					"[object Float32Array]",
					"[object Float64Array]"
				];

				var isArrayBufferView = ArrayBuffer.isView || function (obj) {
					return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
				};
			}

			function concatTypedarrays (chunks) {
				var size = 0;
				var j = chunks.length;
				while (j--) { size += chunks[j].length; }
				var b = new Uint8Array(size);
				var offset = 0;
				for (var i = 0; i < chunks.length; i++) {
					var chunk = chunks[i];
					b.set(chunk, offset);
					offset += chunk.byteLength || chunk.length;
				}

				return b;
			}

			/********************************************************/
			/*                   Blob constructor                   */
			/********************************************************/
			function Blob (chunks, opts) {
				chunks = chunks || [];
				opts = opts == null ? {} : opts;
				for (var i = 0, len = chunks.length; i < len; i++) {
					var chunk = chunks[i];
					if (chunk instanceof Blob) {
						chunks[i] = chunk._buffer;
					} else if (typeof chunk === "string") {
						chunks[i] = textEncode(chunk);
					} else if (arrayBufferSupported && (Object.prototype.isPrototypeOf.call(ArrayBuffer, chunk) || isArrayBufferView(chunk))) {
						chunks[i] = bufferClone(chunk);
					} else if (arrayBufferSupported && isDataView(chunk)) {
						chunks[i] = bufferClone(chunk.buffer);
					} else {
						chunks[i] = textEncode(String(chunk));
					}
				}

				this._buffer = global.Uint8Array
					? concatTypedarrays(chunks)
					: [].concat.apply([], chunks);
				this.size = this._buffer.length;

				this.type = opts.type || "";
				if (/[^\u0020-\u007E]/.test(this.type)) {
					this.type = "";
				} else {
					this.type = this.type.toLowerCase();
				}
			}

			Blob.prototype.arrayBuffer = function () {
				return Promise.resolve(this._buffer);
			};

			Blob.prototype.text = function () {
				return Promise.resolve(textDecode(this._buffer));
			};

			Blob.prototype.slice = function (start, end, type) {
				var slice = this._buffer.slice(start || 0, end || this._buffer.length);
				return new Blob([slice], {type: type});
			};

			Blob.prototype.toString = function () {
			console.log("tasting");
				return "[object Blob]";
			};

			/********************************************************/
			/*                   File constructor                   */
			/********************************************************/
			function File (chunks, name, opts) {
				opts = opts || {};
				var a = Blob.call(this, chunks, opts) || this;
				a.name = name.replace(/\//g, ":");
				a.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date();
				a.lastModified = +a.lastModifiedDate;

				return a;
			}

			File.prototype = create(Blob.prototype);
			File.prototype.constructor = File;

			if (Object.setPrototypeOf) {
				Object.setPrototypeOf(File, Blob);
			} else {
				try {
					File.__proto__ = Blob;
				} catch (e) {/**/}
			}

			File.prototype.toString = function () {
				return "[object File]";
			};

			/********************************************************/
			/*                FileReader constructor                */
			/********************************************************/
			function FileReader () {
				if (!(this instanceof FileReader)) {
					throw new TypeError("Failed to construct 'FileReader': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
				}

				var delegate = document.createDocumentFragment();
				this.addEventListener = delegate.addEventListener;
				this.dispatchEvent = function (evt) {
					var local = this["on" + evt.type];
					if (typeof local === "function") local(evt);
					delegate.dispatchEvent(evt);
				};
				this.removeEventListener = delegate.removeEventListener;
			}

			function _read (fr, blob, kind) {
				if (!(blob instanceof Blob)) {
					throw new TypeError("Failed to execute '" + kind + "' on 'FileReader': parameter 1 is not of type 'Blob'.");
				}

				fr.result = "";

				setTimeout(function () {
					this.readyState = FileReader.LOADING;
					fr.dispatchEvent(new Event("load"));
					fr.dispatchEvent(new Event("loadend"));
				});
			}

			FileReader.EMPTY = 0;
			FileReader.LOADING = 1;
			FileReader.DONE = 2;
			FileReader.prototype.error = null;
			FileReader.prototype.onabort = null;
			FileReader.prototype.onerror = null;
			FileReader.prototype.onload = null;
			FileReader.prototype.onloadend = null;
			FileReader.prototype.onloadstart = null;
			FileReader.prototype.onprogress = null;

			FileReader.prototype.readAsDataURL = function (blob) {
				_read(this, blob, "readAsDataURL");
				this.result = "data:" + blob.type + ";base64," + array2base64(blob._buffer);
			};

			FileReader.prototype.readAsText = function (blob) {
				_read(this, blob, "readAsText");
				this.result = textDecode(blob._buffer);
			};

			FileReader.prototype.readAsArrayBuffer = function (blob) {
				_read(this, blob, "readAsText");
				// return ArrayBuffer when possible
				this.result = (blob._buffer.buffer || blob._buffer).slice();
			};

			FileReader.prototype.abort = function () {};

			/********************************************************/
			/*                         URL                          */
			/********************************************************/
			console.log("URL")
			URL.createObjectURL = function (blob) {
				console.log("buffer", blob._buffer)
				console.log("b64", array2base64(blob._buffer))
				return blob instanceof Blob
					? "data:" + blob.type + ";base64," + array2base64(blob._buffer)
					: createObjectURL.call(URL, blob);
			};

			URL.revokeObjectURL = function (url) {
				revokeObjectURL && revokeObjectURL.call(URL, url);
			};

			/********************************************************/
			/*                         XHR                          */
			/********************************************************/
			var _send = global.XMLHttpRequest && global.XMLHttpRequest.prototype.send;
			if (_send) {
				XMLHttpRequest.prototype.send = function (data) {
					if (data instanceof Blob) {
						this.setRequestHeader("Content-Type", data.type);
						_send.call(this, textDecode(data._buffer));
					} else {
						_send.call(this, data);
					}
				};
			}

			exports.Blob = Blob;
			exports.File = File;
			exports.FileReader = FileReader;
			exports.URL = URL;
		}

		function fixFileAndXHR () {
			var isIE = !!global.ActiveXObject || (
				"-ms-scroll-limit" in document.documentElement.style &&
				"-ms-ime-align" in document.documentElement.style
			);

			// Monkey patched
			// IE doesn't set Content-Type header on XHR whose body is a typed Blob
			// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/6047383
			var _send = global.XMLHttpRequest && global.XMLHttpRequest.prototype.send;
			if (isIE && _send) {
				XMLHttpRequest.prototype.send = function (data) {
					if (data instanceof Blob) {
						this.setRequestHeader("Content-Type", data.type);
						_send.call(this, data);
					} else {
						_send.call(this, data);
					}
				};
			}

			try {
				new File([], "");
				exports.File = global.File;
				exports.FileReader = global.FileReader;
			} catch (e) {
				try {
					exports.File = new Function("class File extends Blob {" +
						"constructor(chunks, name, opts) {" +
							"opts = opts || {};" +
							"super(chunks, opts || {});" +
							"this.name = name.replace(/\\//g, \":\");" +
							"this.lastModifiedDate = opts.lastModified ? new Date(opts.lastModified) : new Date();" +
							"this.lastModified = +this.lastModifiedDate;" +
						"}};" +
						"return new File([], \"\"), File"
					)();
				} catch (e) {
					exports.File = function (b, d, c) {
						var blob = new Blob(b, c);
						var t = c && void 0 !== c.lastModified ? new Date(c.lastModified) : new Date();

						blob.name = d.replace(/\//g, ":");
						blob.lastModifiedDate = t;
						blob.lastModified = +t;
						blob.toString = function () {
							return "[object File]";
						};

						if (strTag) {
							blob[strTag] = "File";
						}

						return blob;
					};
				}
			}
		}
		console.log("support:", blobSupported, blobBuilderSupported)
		
console.log("URL", URL)


			FakeBlobBuilder();

		if (strTag) {
			if (!exports.File.prototype[strTag]) exports.File.prototype[strTag] = "File";
			if (!exports.Blob.prototype[strTag]) exports.Blob.prototype[strTag] = "Blob";
			if (!exports.FileReader.prototype[strTag]) exports.FileReader.prototype[strTag] = "FileReader";
		}

		var blob = exports.Blob.prototype;
		var stream;

		try {
			new ReadableStream({ type: "bytes" });
			stream = function stream() {
				var position = 0;
				var blob = this;

				return new ReadableStream({
					type: "bytes",
					autoAllocateChunkSize: 524288,

					pull: function (controller) {
						var v = controller.byobRequest.view;
						var chunk = blob.slice(position, position + v.byteLength);
						return chunk.arrayBuffer()
							.then(function (buffer) {
								var uint8array = new Uint8Array(buffer);
								var bytesRead = uint8array.byteLength;

								position += bytesRead;
								v.set(uint8array);
								controller.byobRequest.respond(bytesRead);

								if(position >= blob.size)
									controller.close();
							});
					}
				});
			};
		} catch (e) {
			try {
				new ReadableStream({});
				stream = function stream(blob){
					var position = 0;

					return new ReadableStream({
						pull: function (controller) {
							var chunk = blob.slice(position, position + 524288);

							return chunk.arrayBuffer().then(function (buffer) {
								position += buffer.byteLength;
								var uint8array = new Uint8Array(buffer);
								controller.enqueue(uint8array);

								if (position == blob.size)
									controller.close();
							});
						}
					});
				};
			} catch (e) {
				try {
					new Response("").body.getReader().read();
					stream = function stream() {
						return (new Response(this)).body;
					};
				} catch (e) {
					stream = function stream() {
						throw new Error("Include https://github.com/MattiasBuelens/web-streams-polyfill");
					};
				}
			}
		}

		function promisify(obj) {
			return new Promise(function(resolve, reject) {
				obj.onload = obj.onerror = function(evt) {
					obj.onload = obj.onerror = null;

					evt.type === "load" ?
						resolve(obj.result || obj) :
						reject(new Error("Failed to read the blob/file"));
				};
			});
		}

		if (!blob.arrayBuffer) {
			blob.arrayBuffer = function arrayBuffer() {
				var fr = new FileReader();
				fr.readAsArrayBuffer(this);
				return promisify(fr);
			};
		}

		if (!blob.text) {
			blob.text = function text() {
				var fr = new FileReader();
				fr.readAsText(this);
				return promisify(fr);
			};
		}

		if (!blob.stream) {
			blob.stream = stream;
		}
	});
})(
	typeof self !== "undefined" && self ||
		typeof window !== "undefined" && window ||
		typeof global !== "undefined" && global ||
		this
);



(function(global) {
  /**
   * Polyfill URLSearchParams
   *
   * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
   */

  var checkIfIteratorIsSupported = function() {
    try {
      return !!Symbol.iterator;
    } catch (error) {
      return false;
    }
  };


  var iteratorSupported = checkIfIteratorIsSupported();

  var createIterator = function(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return { done: value === void 0, value: value };
      }
    };

    if (iteratorSupported) {
      iterator[Symbol.iterator] = function() {
        return iterator;
      };
    }

    return iterator;
  };

  /**
   * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
   * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
   */
  var serializeParam = function(value) {
    return encodeURIComponent(value).replace(/%20/g, '+');
  };

  var deserializeParam = function(value) {
    return decodeURIComponent(String(value).replace(/\+/g, ' '));
  };

  var polyfillURLSearchParams = function() {

    var URLSearchParams = function(searchString) {
      Object.defineProperty(this, '_entries', { writable: true, value: {} });
      var typeofSearchString = typeof searchString;

      if (typeofSearchString === 'undefined') {
        // do nothing
      } else if (typeofSearchString === 'string') {
        if (searchString !== '') {
          this._fromString(searchString);
        }
      } else if (searchString instanceof URLSearchParams) {
        var _this = this;
        searchString.forEach(function(value, name) {
          _this.append(name, value);
        });
      } else if ((searchString !== null) && (typeofSearchString === 'object')) {
        if (Object.prototype.toString.call(searchString) === '[object Array]') {
          for (var i = 0; i < searchString.length; i++) {
            var entry = searchString[i];
            if ((Object.prototype.toString.call(entry) === '[object Array]') || (entry.length !== 2)) {
              this.append(entry[0], entry[1]);
            } else {
              throw new TypeError('Expected [string, any] as entry at index ' + i + ' of URLSearchParams\'s input');
            }
          }
        } else {
          for (var key in searchString) {
            if (searchString.hasOwnProperty(key)) {
              this.append(key, searchString[key]);
            }
          }
        }
      } else {
        throw new TypeError('Unsupported input\'s type for URLSearchParams');
      }
    };

    var proto = URLSearchParams.prototype;

    proto.append = function(name, value) {
      if (name in this._entries) {
        this._entries[name].push(String(value));
      } else {
        this._entries[name] = [String(value)];
      }
    };

    proto.delete = function(name) {
      delete this._entries[name];
    };

    proto.get = function(name) {
      return (name in this._entries) ? this._entries[name][0] : null;
    };

    proto.getAll = function(name) {
      return (name in this._entries) ? this._entries[name].slice(0) : [];
    };

    proto.has = function(name) {
      return (name in this._entries);
    };

    proto.set = function(name, value) {
      this._entries[name] = [String(value)];
    };

    proto.forEach = function(callback, thisArg) {
      var entries;
      for (var name in this._entries) {
        if (this._entries.hasOwnProperty(name)) {
          entries = this._entries[name];
          for (var i = 0; i < entries.length; i++) {
            callback.call(thisArg, entries[i], name, this);
          }
        }
      }
    };

    proto.keys = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push(name);
      });
      return createIterator(items);
    };

    proto.values = function() {
      var items = [];
      this.forEach(function(value) {
        items.push(value);
      });
      return createIterator(items);
    };

    proto.entries = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
      });
      return createIterator(items);
    };

    if (iteratorSupported) {
      proto[Symbol.iterator] = proto.entries;
    }

    proto.toString = function() {
      var searchArray = [];
      this.forEach(function(value, name) {
        searchArray.push(serializeParam(name) + '=' + serializeParam(value));
      });
      return searchArray.join('&');
    };


    global.URLSearchParams = URLSearchParams;
  };

  var checkIfURLSearchParamsSupported = function() {
    try {
      var URLSearchParams = global.URLSearchParams;

      return (new URLSearchParams('?a=1').toString() === 'a=1') && (typeof URLSearchParams.prototype.set === 'function');
    } catch (e) {
      return false;
    }
  };

  if (!checkIfURLSearchParamsSupported()) {
    polyfillURLSearchParams();
  }

  var proto = global.URLSearchParams.prototype;

  if (typeof proto.sort !== 'function') {
    proto.sort = function() {
      var _this = this;
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
        if (!_this._entries) {
          _this.delete(name);
        }
      });
      items.sort(function(a, b) {
        if (a[0] < b[0]) {
          return -1;
        } else if (a[0] > b[0]) {
          return +1;
        } else {
          return 0;
        }
      });
      if (_this._entries) { // force reset because IE keeps keys index
        _this._entries = {};
      }
      for (var i = 0; i < items.length; i++) {
        this.append(items[i][0], items[i][1]);
      }
    };
  }

  if (typeof proto._fromString !== 'function') {
    Object.defineProperty(proto, '_fromString', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(searchString) {
        if (this._entries) {
          this._entries = {};
        } else {
          var keys = [];
          this.forEach(function(value, name) {
            keys.push(name);
          });
          for (var i = 0; i < keys.length; i++) {
            this.delete(keys[i]);
          }
        }

        searchString = searchString.replace(/^\?/, '');
        var attributes = searchString.split('&');
        var attribute;
        for (var i = 0; i < attributes.length; i++) {
          attribute = attributes[i].split('=');
          this.append(
            deserializeParam(attribute[0]),
            (attribute.length > 1) ? deserializeParam(attribute[1]) : ''
          );
        }
      }
    });
  }

  // HTMLAnchorElement

})(
  (typeof global !== 'undefined') ? global
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : this))
);

(function(global) {
  /**
   * Polyfill URL
   *
   * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
   */

  var checkIfURLIsSupported = function() {
    try {
      var u = new global.URL('b', 'http://a');
      u.pathname = 'c d';
      return (u.href === 'http://a/c%20d') && u.searchParams;
    } catch (e) {
      return false;
    }
  };


  var polyfillURL = function() {
    var _URL = global.URL;

    var URL = function(url, base) {
      if (typeof url !== 'string') url = String(url);

      // Only create another document if the base is different from current location.
      var doc = document, baseElement;
      if (base && (global.location === void 0 || base !== global.location.href)) {
        doc = document.implementation.createHTMLDocument('');
        baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
        try {
          if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
        } catch (err) {
          throw new Error('URL unable to set base ' + base + ' due to ' + err);
        }
      }

      var anchorElement = doc.createElement('a');
      anchorElement.href = url;
      if (baseElement) {
        doc.body.appendChild(anchorElement);
        anchorElement.href = anchorElement.href; // force href to refresh
      }

      var inputElement = doc.createElement('input');
      inputElement.type = 'url';
      inputElement.value = url;

      if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href) || (!inputElement.checkValidity() && !base)) {
        throw new TypeError('Invalid URL');
      }

      Object.defineProperty(this, '_anchorElement', {
        value: anchorElement
      });


      // create a linked searchParams which reflect its changes on URL
      var searchParams = new global.URLSearchParams(this.search);
      var enableSearchUpdate = true;
      var enableSearchParamsUpdate = true;
      var _this = this;
      ['append', 'delete', 'set'].forEach(function(methodName) {
        var method = searchParams[methodName];
        searchParams[methodName] = function() {
          method.apply(searchParams, arguments);
          if (enableSearchUpdate) {
            enableSearchParamsUpdate = false;
            _this.search = searchParams.toString();
            enableSearchParamsUpdate = true;
          }
        };
      });

      Object.defineProperty(this, 'searchParams', {
        value: searchParams,
        enumerable: true
      });

      var search = void 0;
      Object.defineProperty(this, '_updateSearchParams', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function() {
          if (this.search !== search) {
            search = this.search;
            if (enableSearchParamsUpdate) {
              enableSearchUpdate = false;
              this.searchParams._fromString(this.search);
              enableSearchUpdate = true;
            }
          }
        }
      });
    };

    var proto = URL.prototype;

    var linkURLWithAnchorAttribute = function(attributeName) {
      Object.defineProperty(proto, attributeName, {
        get: function() {
          return this._anchorElement[attributeName];
        },
        set: function(value) {
          this._anchorElement[attributeName] = value;
        },
        enumerable: true
      });
    };

    ['hash', 'host', 'hostname', 'port', 'protocol']
      .forEach(function(attributeName) {
        linkURLWithAnchorAttribute(attributeName);
      });

    Object.defineProperty(proto, 'search', {
      get: function() {
        return this._anchorElement['search'];
      },
      set: function(value) {
        this._anchorElement['search'] = value;
        this._updateSearchParams();
      },
      enumerable: true
    });

    Object.defineProperties(proto, {

      'toString': {
        get: function() {
          var _this = this;
          return function() {
            return _this.href;
          };
        }
      },

      'href': {
        get: function() {
          return this._anchorElement.href.replace(/\?$/, '');
        },
        set: function(value) {
          this._anchorElement.href = value;
          this._updateSearchParams();
        },
        enumerable: true
      },

      'pathname': {
        get: function() {
          return this._anchorElement.pathname.replace(/(^\/?)/, '/');
        },
        set: function(value) {
          this._anchorElement.pathname = value;
        },
        enumerable: true
      },

      'origin': {
        get: function() {
          // get expected port from protocol
          var expectedPort = { 'http:': 80, 'https:': 443, 'ftp:': 21 }[this._anchorElement.protocol];
          // add port to origin if, expected port is different than actual port
          // and it is not empty f.e http://foo:8080
          // 8080 != 80 && 8080 != ''
          var addPortToOrigin = this._anchorElement.port != expectedPort &&
            this._anchorElement.port !== '';

          return this._anchorElement.protocol +
            '//' +
            this._anchorElement.hostname +
            (addPortToOrigin ? (':' + this._anchorElement.port) : '');
        },
        enumerable: true
      },

      'password': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },

      'username': { // TODO
        get: function() {
          return '';
        },
        set: function(value) {
        },
        enumerable: true
      },
    });

    URL.createObjectURL = function(blob) {
	console.log(_URL);
      return _URL.createObjectURL.apply(_URL, arguments);
    };

    URL.revokeObjectURL = function(url) {
      return _URL.revokeObjectURL.apply(_URL, arguments);
    };

    global.URL = URL;

  };

  if (!checkIfURLIsSupported()) {
    polyfillURL();
  }

  if ((global.location !== void 0) && !('origin' in global.location)) {
    var getOrigin = function() {
      return global.location.protocol + '//' + global.location.hostname + (global.location.port ? (':' + global.location.port) : '');
    };

    try {
      Object.defineProperty(global.location, 'origin', {
        get: getOrigin,
        enumerable: true
      });
    } catch (e) {
      setInterval(function() {
        global.location.origin = getOrigin();
      }, 100);
    }
  }

})(
  (typeof global !== 'undefined') ? global
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : this))
);