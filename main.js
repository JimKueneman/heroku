var $R = [
	"Method %s in class %s threw exception [%s]",
	"Procedure %s threw exception [%s]",
	"Host classtype was rejected as unsuitable",
	"Invalid handle for operation, reference was null error",
	"Invalid stream style for operation, expected memorystream",
	"Method not implemented",
	"stream operation failed, system threw exception: %s",
	"write failed, system threw exception: %s",
	"read failed, system threw exception: %s",
	"operation failed, invalid handle error",
	"Invalid length, %s bytes exceeds storage medium error",
	"Read failed, invalid signature error [%s]",
	"Invalid length, %s bytes exceeds storage boundaries error",
	"Write failed, invalid signature error [%s]",
	"Write failed, invalid datasize [%d] error",
	"File operation [%s] failed, system threw exception: %s",
	"Structure %s error, method %s.%s threw exception [%s] error",
	"Structure storage failed, structure contains function reference error",
	"Structure storage failed, structure contains symbol reference error",
	"Structure storage failed, structure contains uknown datatype error",
	"Failed to read structure, method %s.%s threw exception [%s] error",
	"Failed to write structure, method %s.%s threw exception [%s] error",
	"Structure data contains invalid or damaged data signature error",
	"Filesystem is nil error",
	"Filesystem not mounted error",
	"Read failed, invalid offset [%d], expected %d..%d",
	"Write operation failed, target stream is nil error",
	"Read operation failed, source stream is nil error",
	"'Invalid handle for object (%s), reference rejected error",
	"0123456789",
	"0123456789ABCDEF"];
function Trim$_String_(s) { return s.replace(/^\s\s*/, "").replace(/\s\s*$/, "") }
var TObject={
	$ClassName: "TObject",
	$Parent: null,
	ClassName: function (s) { return s.$ClassName },
	ClassType: function (s) { return s },
	ClassParent: function (s) { return s.$Parent },
	$Init: function (s) {},
	Create: function (s) { return s },
	Destroy: function (s) { for (var prop in s) if (s.hasOwnProperty(prop)) delete s[prop] },
	Destroy$: function(s) { return s.ClassType.Destroy(s) },
	Free: function (s) { if (s!==null) s.ClassType.Destroy(s) }
}
function StrReplace(s,o,n) { return o?s.replace(new RegExp(StrRegExp(o), "g"), n):s }
function StrRegExp(s) { return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") }
function StrEndsWith(s,e) { return s.substr(s.length-e.length)==e }
function StrBeginsWith(s,b) { return s.substr(0, b.length)==b }
function SameText(a,b) { return a.toUpperCase()==b.toUpperCase() }
function RightStr(s,n) { return s.substr(s.length-n) }
function Now() { var d=new Date(); var utcnow=d.getTime()/864e5+25569; var dt = new Date(); var n = dt.getTimezoneOffset(); return utcnow-n/1440 }
function IntToHex2(v) { var r=v.toString(16); return (r.length==1)?"0"+r:r }
/**
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}
	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	str_format.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = String(parseInt(arg, 10)); if (match[7]) { arg = str_repeat('0', match[7]-arg.length)+arg } break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = Math.abs(arg); break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();
function Format(f,a) { a.unshift(f); return sprintf.apply(null,a) }
var Exception={
	$ClassName: "Exception",
	$Parent: TObject,
	$Init: function (s) { FMessage="" },
	Create: function (s,Msg) { s.FMessage=Msg; return s }
}
function Delete(s,i,n) { var v=s.v; if ((i<=0)||(i>v.length)||(n<=0)) return; s.v=v.substr(0,i-1)+v.substr(i+n-1); }
function ClampInt(v,mi,ma) { return v<mi ? mi : v>ma ? ma : v }
function $W(e) { return e.ClassType?e:Exception.Create($New(Exception),e.constructor.name+", "+e.message) }
// inspired from 
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/charCodeAt
function $uniCharAt(str, idx) {
    var c = str.charCodeAt(idx);
    if (0xD800 <= c && c <= 0xDBFF) { // High surrogate
        return str.substr(idx, 2);
    }
    if (0xDC00 <= c && c <= 0xDFFF) { // Low surrogate
        return null;
    }
    return str.charAt(idx);
}function $SetIn(s,v,m,n) { v-=m; return (v<0 && v>=n)?false:(s[v>>5]&(1<<(v&31)))!=0 }
Array.prototype.pusha = function (e) { this.push.apply(this, e); return this }
function $NewDyn(c,z) {
	if (c==null) throw Exception.Create($New(Exception),"ClassType is nil"+z);
	var i={ClassType:c};
	c.$Init(i);
	return i
}
function $New(c) { var i={ClassType:c}; c.$Init(i); return i }
function $Is(o,c) {
	if (o===null) return false;
	return $Inh(o.ClassType,c);
}
;
function $Inh(s,c) {
	if (s===null) return false;
	while ((s)&&(s!==c)) s=s.$Parent;
	return (s)?true:false;
}
;
function $Extend(base, sub, props) {
	function F() {};
	F.prototype = base.prototype;
	sub.prototype = new F();
	sub.prototype.constructor = sub;
	for (var n in props) {
		if (props.hasOwnProperty(n)) {
			sub.prototype[n]=props[n];
		}
	}
}
function $Event3(i,f) {
	var li=i,lf=f;
	return function(a,b,c) {
		return lf.call(li,li,a,b,c)
	}
}
function $Event2(i,f) {
	var li=i,lf=f;
	return function(a,b) {
		return lf.call(li,li,a,b)
	}
}
function $Event1(i,f) {
	var li=i,lf=f;
	return function(a) {
		return lf.call(li,li,a)
	}
}
function $Event0(i,f) {
	var li=i,lf=f;
	return function() {
		return lf.call(li,li)
	}
}
function $AsIntf(o,i) {
	if (o===null) return null;
	var r = o.ClassType.$Intf[i].map(function (e) {
		return function () {
			var arg=Array.prototype.slice.call(arguments);
			arg.splice(0,0,o);
			return e.apply(o, arg);
		}
	});
	r.O = o;
	return r;
}
;
function $As(o,c) {
	if ((o===null)||$Is(o,c)) return o;
	throw Exception.Create($New(Exception),"Cannot cast instance of type \""+o.ClassType.$ClassName+"\" to class \""+c.$ClassName+"\"");
}
function $ArraySetLenC(a,n,d) {
	var o=a.length;
	if (o==n) return;
	if (o>n) a.length=n; else for (;o<n;o++) a.push(d());
}
/// TServer = class (TObject)
///  [line: 16, column: 3, file: Unit1]
var TServer = {
   $ClassName:"TServer",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FServer = null;
   }
   /// procedure TServer.HandleServerStarted(Sender: TObject)
   ///  [line: 52, column: 19, file: Unit1]
   ,HandleServerStarted:function(Self, Sender) {
      WriteLnF("Server listening on port %d",[TNJCustomServer.GetPort(Self.FServer)]);
   }
   /// procedure TServer.HandleRequest(Sender: TObject; const Request: TNJHttpRequest; const Response: TNJHttpResponse)
   ///  [line: 57, column: 19, file: Unit1]
   ,HandleRequest:function(Self, Sender$1, Request, Response) {
      var content$1 = "";
      TW3HandleBasedObject.GetObjectHandle(Request).on("data",function (data) {
         content$1 = String(data);
      });
      TW3HandleBasedObject.GetObjectHandle(Request).on("end",function (data$1) {
         TNJHttpResponse.End$1(Response,("Headers: "+TJSONObject.ToString$1(TNJHttpRequest.GetHeaders(Request))+"\r\n"+"Content: "+content$1));
         TObject.Free(Request);
         TObject.Free(Response);
      });
   }
   /// procedure TServer.Run()
   ///  [line: 46, column: 19, file: Unit1]
   ,Run:function(Self) {
      TNJCustomServer.Start(Self.FServer);
   }
   /// constructor TServer.Create()
   ///  [line: 31, column: 21, file: Unit1]
   ,Create$3:function(Self) {
      TObject.Create(Self);
      Self.FServer = TW3ErrorObject.Create$31($New(TNJHTTPServer));
      TNJCustomServer.SetPort(Self.FServer,1881);
      Self.FServer.OnAfterServerStarted = $Event1(Self,TServer.HandleServerStarted);
      Self.FServer.OnRequest = $Event3(Self,TServer.HandleRequest);
      return Self
   }
   /// destructor TServer.Destroy()
   ///  [line: 40, column: 20, file: Unit1]
   ,Destroy:function(Self) {
      TObject.Free(Self.FServer);
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// function TW3VariantHelper.DataType(const Self: Variant) : TW3VariantDataType
///  [line: 1825, column: 27, file: System.Types]
function TW3VariantHelper$DataType(Self$1) {
   var Result = 1;
   var LType = "";
   if (TW3VariantHelper$Valid$2(Self$1)) {
      LType = typeof(Self$1);
      {var $temp1 = (LType).toLocaleLowerCase();
         if ($temp1=="object") {
            if (!Self$1.length) {
               Result = 8;
            } else {
               Result = 9;
            }
         }
          else if ($temp1=="function") {
            Result = 7;
         }
          else if ($temp1=="symbol") {
            Result = 6;
         }
          else if ($temp1=="boolean") {
            Result = 2;
         }
          else if ($temp1=="string") {
            Result = 5;
         }
          else if ($temp1=="number") {
            if (Math.round(Number(Self$1))!=Self$1) {
               Result = 4;
            } else {
               Result = 3;
            }
         }
          else if ($temp1=="array") {
            Result = 9;
         }
          else {
            Result = 1;
         }
      }
   } else if (Self$1==null) {
      Result = 10;
   } else {
      Result = 1;
   }
   return Result
}
/// function TW3VariantHelper.IsObject(const Self: Variant) : Boolean
///  [line: 1872, column: 27, file: System.Types]
function TW3VariantHelper$IsObject(Self$2) {
   var Result = false;
   Result = ((Self$2) !== undefined)
      && (Self$2 !== null)
      && (typeof Self$2  === "object")
      && ((Self$2).length === undefined);
   return Result
}
/// function TW3VariantHelper.Valid(const Self: Variant) : Boolean
///  [line: 1783, column: 27, file: System.Types]
function TW3VariantHelper$Valid$2(Self$3) {
   var Result = false;
   Result = !( (Self$3 == undefined) || (Self$3 == null) );
   return Result
}
/// TW3VariantDataType enumeration
///  [line: 558, column: 3, file: System.Types]
var TW3VariantDataType = { 1:"vdUnknown", 2:"vdBoolean", 3:"vdinteger", 4:"vdfloat", 5:"vdstring", 6:"vdSymbol", 7:"vdFunction", 8:"vdObject", 9:"vdArray", 10:"vdVariant" };
/// TW3OwnedObject = class (TObject)
///  [line: 356, column: 3, file: System.Types]
var TW3OwnedObject = {
   $ClassName:"TW3OwnedObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FOwner = null;
   }
   /// function TW3OwnedObject.GetOwner() : TObject
   ///  [line: 1176, column: 26, file: System.Types]
   ,GetOwner:function(Self) {
      return Self.FOwner;
   }
   /// procedure TW3OwnedObject.SetOwner(const NewOwner: TObject)
   ///  [line: 1186, column: 26, file: System.Types]
   ,SetOwner:function(Self, NewOwner) {
      if (NewOwner!==Self.FOwner) {
         if (TW3OwnedObject.AcceptOwner$(Self,NewOwner)) {
            Self.FOwner = NewOwner;
         } else {
            throw EW3Exception.CreateFmt($New(EW3OwnedObject),$R[0],["TW3OwnedObject.SetOwner", TObject.ClassName(Self.ClassType), $R[2]]);
         }
      }
   }
   /// function TW3OwnedObject.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 1181, column: 25, file: System.Types]
   ,AcceptOwner:function(Self, CandidateObject) {
      return true;
   }
   /// constructor TW3OwnedObject.Create(const AOwner: TObject)
   ///  [line: 1170, column: 28, file: System.Types]
   ,Create$13:function(Self, AOwner) {
      TObject.Create(Self);
      TW3OwnedObject.SetOwner(Self,AOwner);
      return Self
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$13$:function($){return $.ClassType.Create$13.apply($.ClassType, arguments)}
};
TW3OwnedObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3OwnedLockedObject = class (TW3OwnedObject)
///  [line: 370, column: 3, file: System.Types]
var TW3OwnedLockedObject = {
   $ClassName:"TW3OwnedLockedObject",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.OnObjectUnLocked = null;
      $.OnObjectLocked = null;
      $.FLocked = 0;
   }
   /// procedure TW3OwnedLockedObject.DisableAlteration()
   ///  [line: 1132, column: 32, file: System.Types]
   ,DisableAlteration:function(Self) {
      ++Self.FLocked;
      if (Self.FLocked==1) {
         TW3OwnedLockedObject.ObjectLocked(Self);
      }
   }
   /// procedure TW3OwnedLockedObject.EnableAlteration()
   ///  [line: 1139, column: 32, file: System.Types]
   ,EnableAlteration:function(Self) {
      if (Self.FLocked>0) {
         --Self.FLocked;
         if (!Self.FLocked) {
            TW3OwnedLockedObject.ObjectUnLocked(Self);
         }
      }
   }
   /// function TW3OwnedLockedObject.GetLockState() : Boolean
   ///  [line: 1149, column: 31, file: System.Types]
   ,GetLockState:function(Self) {
      return Self.FLocked>0;
   }
   /// procedure TW3OwnedLockedObject.ObjectLocked()
   ///  [line: 1154, column: 32, file: System.Types]
   ,ObjectLocked:function(Self) {
      if (Self.OnObjectLocked) {
         Self.OnObjectLocked(Self);
      }
   }
   /// procedure TW3OwnedLockedObject.ObjectUnLocked()
   ///  [line: 1160, column: 32, file: System.Types]
   ,ObjectUnLocked:function(Self) {
      if (Self.OnObjectUnLocked) {
         Self.OnObjectUnLocked(Self);
      }
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13:TW3OwnedObject.Create$13
};
TW3OwnedLockedObject.$Intf={
   IW3LockObject:[TW3OwnedLockedObject.DisableAlteration,TW3OwnedLockedObject.EnableAlteration,TW3OwnedLockedObject.GetLockState]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3LockedObject = class (TObject)
///  [line: 388, column: 3, file: System.Types]
var TW3LockedObject = {
   $ClassName:"TW3LockedObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.OnObjectUnLocked = null;
      $.OnObjectLocked = null;
      $.FLocked$1 = 0;
   }
   /// procedure TW3LockedObject.DisableAlteration()
   ///  [line: 1093, column: 27, file: System.Types]
   ,DisableAlteration$1:function(Self) {
      ++Self.FLocked$1;
      if (Self.FLocked$1==1) {
         TW3LockedObject.ObjectLocked$1$(Self);
      }
   }
   /// procedure TW3LockedObject.EnableAlteration()
   ///  [line: 1100, column: 27, file: System.Types]
   ,EnableAlteration$1:function(Self) {
      if (Self.FLocked$1>0) {
         --Self.FLocked$1;
         if (!Self.FLocked$1) {
            TW3LockedObject.ObjectUnLocked$1$(Self);
         }
      }
   }
   /// function TW3LockedObject.GetLockState() : Boolean
   ///  [line: 1110, column: 26, file: System.Types]
   ,GetLockState$1:function(Self) {
      return Self.FLocked$1>0;
   }
   /// procedure TW3LockedObject.ObjectLocked()
   ///  [line: 1115, column: 27, file: System.Types]
   ,ObjectLocked$1:function(Self) {
      if (Self.OnObjectLocked) {
         Self.OnObjectLocked(Self);
      }
   }
   /// procedure TW3LockedObject.ObjectUnLocked()
   ///  [line: 1121, column: 27, file: System.Types]
   ,ObjectUnLocked$1:function(Self) {
      if (Self.OnObjectUnLocked) {
         Self.OnObjectUnLocked(Self);
      }
   }
   ,Destroy:TObject.Destroy
   ,ObjectLocked$1$:function($){return $.ClassType.ObjectLocked$1($)}
   ,ObjectUnLocked$1$:function($){return $.ClassType.ObjectUnLocked$1($)}
};
TW3LockedObject.$Intf={
   IW3LockObject:[TW3LockedObject.DisableAlteration$1,TW3LockedObject.EnableAlteration$1,TW3LockedObject.GetLockState$1]
}
/// TW3FilePermissionMask enumeration
///  [line: 78, column: 3, file: System.Types]
var TW3FilePermissionMask = { 0:"fpNone", 111:"fpExecute", 222:"fpWrite", 333:"fpWriteExecute", 444:"fpRead", 555:"fpReadExecute", 666:"fpDefault", 777:"fpReadWriteExecute", 740:"fpRWEGroupReadOnly" };
/// TVariant = class (TObject)
///  [line: 510, column: 3, file: System.Types]
var TVariant = {
   $ClassName:"TVariant",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TVariant.AsBool(const aValue: Variant) : Boolean
   ///  [line: 2231, column: 25, file: System.Types]
   ,AsBool:function(aValue) {
      var Result = false;
      if (aValue!=undefined&&aValue!=null) {
         Result = (aValue?true:false);
      }
      return Result
   }
   /// function TVariant.AsFloat(const aValue: Variant) : Float
   ///  [line: 2214, column: 25, file: System.Types]
   ,AsFloat:function(aValue$1) {
      var Result = 0;
      if (aValue$1!=undefined&&aValue$1!=null) {
         Result = Number(aValue$1);
      }
      return Result
   }
   /// function TVariant.AsInteger(const aValue: Variant) : Integer
   ///  [line: 2200, column: 25, file: System.Types]
   ,AsInteger:function(aValue$2) {
      var Result = 0;
      if (aValue$2!=undefined&&aValue$2!=null) {
         Result = parseInt(aValue$2,10);
      }
      return Result
   }
   /// function TVariant.AsString(const aValue: Variant) : String
   ///  [line: 2207, column: 25, file: System.Types]
   ,AsString:function(aValue$3) {
      var Result = "";
      if (aValue$3!=undefined&&aValue$3!=null) {
         Result = String(aValue$3);
      }
      return Result
   }
   /// function TVariant.CreateObject() : Variant
   ///  [line: 2238, column: 25, file: System.Types]
   ,CreateObject:function() {
      var Result = undefined;
      Result = new Object();
      return Result
   }
   /// procedure TVariant.ForEachProperty(const Data: Variant; const CallBack: TW3ObjectKeyCallback)
   ///  [line: 2321, column: 26, file: System.Types]
   ,ForEachProperty:function(Data$1, CallBack) {
      var LObj,
         Keys$1 = [],
         a$202 = 0;
      var LName = "";
      if (CallBack) {
         Keys$1 = TVariant.Properties(Data$1);
         var $temp2;
         for(a$202=0,$temp2=Keys$1.length;a$202<$temp2;a$202++) {
            LName = Keys$1[a$202];
            LObj = Keys$1[LName];
            if ((~CallBack(LName,LObj))==1) {
               break;
            }
         }
      }
   }
   /// function TVariant.Properties(const Data: Variant) : TStrArray
   ///  [line: 2340, column: 25, file: System.Types]
   ,Properties:function(Data$2) {
      var Result = [];
      if (Data$2) {
         if (!(Object.keys === undefined)) {
        Result = Object.keys(Data$2);
        return Result;
      }
         if (!(Object.getOwnPropertyNames === undefined)) {
          Result = Object.getOwnPropertyNames(Data$2);
          return Result;
      }
         for (var qtxenum in Data$2) {
        if ( (Data$2).hasOwnProperty(qtxenum) == true )
          (Result).push(qtxenum);
      }
      return Result;
      }
      return Result
   }
   /// function TVariant.ValidRef(const aValue: Variant) : Boolean
   ///  [line: 2195, column: 25, file: System.Types]
   ,ValidRef:function(aValue$4) {
      return aValue$4!=undefined&&aValue$4!=null;
   }
   ,Destroy:TObject.Destroy
};
/// TTextFormation enumeration
///  [line: 199, column: 3, file: System.Types]
var TTextFormation = { 256:"tfHex", 257:"tfOrdinal", 258:"tfFloat", 259:"tfQuote" };
/// function TStringHelper.ContainsHex(const Self: String) : Boolean
///  [line: 1650, column: 24, file: System.Types]
function TStringHelper$ContainsHex(Self$4) {
   var Result = false;
   var x$1 = 0;
   var LStart = 0;
   var LItem = "";
   var LLen = 0;
   Result = false;
   LLen = Self$4.length;
   if (LLen>=1) {
      LStart = 1;
      if (Self$4.charAt(0)=="$") {
         ++LStart;
         --LLen;
      } else {
         LItem = (Self$4.substr(0,1)).toLocaleUpperCase();
         Result = ($R[30].indexOf(LItem)+1)>0;
         if (!Result) {
            return Result;
         }
      }
      if (LLen>=1) {
         var $temp3;
         for(x$1=LStart,$temp3=Self$4.length;x$1<=$temp3;x$1++) {
            LItem = (Self$4.charAt(x$1-1)).toLocaleUpperCase();
            Result = ($R[30].indexOf(LItem)+1)>0;
            if (!Result) {
               break;
            }
         }
      }
   }
   return Result
}
/// function TStringHelper.ContainsOrdinal(const Self: String) : Boolean
///  [line: 1634, column: 24, file: System.Types]
function TStringHelper$ContainsOrdinal(Self$5) {
   var Result = false;
   var LLen$1 = 0,
      x$2 = 0;
   var LItem$1 = "";
   Result = false;
   LLen$1 = Self$5.length;
   if (LLen$1>=1) {
      var $temp4;
      for(x$2=1,$temp4=LLen$1;x$2<=$temp4;x$2++) {
         LItem$1 = Self$5.charAt(x$2-1);
         Result = ($R[29].indexOf(LItem$1)+1)>0;
         if (!Result) {
            break;
         }
      }
   }
   return Result
}
/// function TStringHelper.ContainsFloat(const Self: String) : Boolean
///  [line: 1579, column: 24, file: System.Types]
function TStringHelper$ContainsFloat(Self$6) {
   var Result = false;
   var x$3 = 0;
   var LItem$2 = "";
   var LLen$2 = 0;
   var LLine = false;
   Result = false;
   LLen$2 = Self$6.length;
   if (LLen$2>=1) {
      LLine = false;
      var $temp5;
      for(x$3=1,$temp5=LLen$2;x$3<=$temp5;x$3++) {
         LItem$2 = Self$6.charAt(x$3-1);
         if (LItem$2==".") {
            if (x$3==1&&LLen$2==1) {
               break;
            }
            if (x$3==1&&LLen$2>1) {
               LLine = true;
               continue;
            }
            if (x$3>1&&x$3<LLen$2) {
               if (LLine) {
                  break;
               } else {
                  LLine = true;
                  continue;
               }
            } else {
               break;
            }
         }
         Result = ("0123456789".indexOf(LItem$2)+1)>0;
         if (!Result) {
            break;
         }
      }
   }
   return Result
}
/// function TStringHelper.ContainsQuote(const Self: String) : Boolean
///  [line: 1498, column: 24, file: System.Types]
function TStringHelper$ContainsQuote(Self$7) {
   var Result = false;
   var LLen$3 = 0;
   var LStart$1 = 0;
   var LFound = false;
   var LQuote = ["",""];
   Result = false;
   LLen$3 = Self$7.length;
   if (LLen$3>=2) {
      LStart$1 = 1;
      while (LStart$1<=LLen$3) {
         if (Self$7.charAt(LStart$1-1)==" ") {
            ++LStart$1;
            continue;
         } else {
            break;
         }
      }
      LQuote[false?1:0] = "'";
      LQuote[true?1:0] = "\"";
      if (Self$7.charAt(LStart$1-1)!=LQuote[true?1:0]||Self$7.charAt(LStart$1-1)!=LQuote[false?1:0]) {
         return Result;
      }
      if (LStart$1>=LLen$3) {
         return Result;
      }
      ++LStart$1;
      LFound = false;
      while (LStart$1<=LLen$3) {
         if (Self$7.charAt(LStart$1-1)!=LQuote[true?1:0]||Self$7.charAt(LStart$1-1)!=LQuote[false?1:0]) {
            LFound = true;
         }
         ++LStart$1;
      }
      if (!LFound) {
         return Result;
      }
      if (LStart$1==LLen$3) {
         Result = true;
         return Result;
      }
      while (LStart$1<=LLen$3) {
         if (Self$7.charAt(LStart$1-1)!=" ") {
            LFound = false;
            break;
         } else {
            ++LStart$1;
         }
      }
      Result = LFound;
   }
   return Result
}
/// TString = class (TObject)
///  [line: 157, column: 3, file: System.Types.Convert]
var TString = {
   $ClassName:"TString",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TString.CharCodeFor(const Character: Char) : Integer
   ///  [line: 1219, column: 24, file: System.Types]
   ,CharCodeFor:function(Self, Character) {
      var Result = 0;
      Result = (Character).charCodeAt(0);
      return Result
   }
   /// function TString.DecodeBase64(TextToDecode: String) : String
   ///  [line: 1508, column: 24, file: System.Types.Convert]
   ,DecodeBase64:function(Self, TextToDecode) {
      return TBase64EncDec.Base64ToString(TBase64EncDec,TextToDecode);
   }
   /// function TString.DecodeUTF8(const BytesToDecode: TByteArray) : String
   ///  [line: 1294, column: 24, file: System.Types]
   ,DecodeUTF8:function(Self, BytesToDecode) {
      var Result = "";
      var i = 0,
         c = 0,
         c2 = 0,
         c2$1 = 0,
         c3 = 0;
      i = 0;
      while (i<BytesToDecode.length) {
         c = BytesToDecode[i];
         if (c<128) {
            Result+=TString.FromCharCode(TString,c);
            ++i;
         } else if (c>191&&c<224) {
            c2 = BytesToDecode[i+1];
            Result+=TString.FromCharCode(TString,(((c&31)<<6)|(c2&63)));
            (i+= 2);
         } else {
            c2$1 = BytesToDecode[i+1];
            c3 = BytesToDecode[i+2];
            Result+=TString.FromCharCode(TString,(((c&15)<<12)|(((c2$1&63)<<6)|(c3&63))));
            (i+= 3);
         }
      }
      return Result
   }
   /// function TString.EncodeBase64(TextToEncode: String) : String
   ///  [line: 1503, column: 24, file: System.Types.Convert]
   ,EncodeBase64:function(Self, TextToEncode) {
      return TBase64EncDec.StringToBase64(TBase64EncDec,TextToEncode);
   }
   /// function TString.EncodeUTF8(TextToEncode: String) : TByteArray
   ///  [line: 1268, column: 24, file: System.Types]
   ,EncodeUTF8:function(Self, TextToEncode$1) {
      var Result = [];
      var n = 0;
      var c$1 = 0;
      TextToEncode$1 = StrReplace(TextToEncode$1,"\r\n","\r");
      if (TextToEncode$1.length>0) {
         var $temp6;
         for(n=1,$temp6=TextToEncode$1.length;n<=$temp6;n++) {
            c$1 = TString.CharCodeFor(TString,TextToEncode$1.charAt(n-1));
            if (c$1<128) {
               Result.push(c$1);
            } else if (c$1>127&&c$1<2048) {
               Result.push(((c$1>>>6)|192));
               Result.push(((c$1&63)|128));
            } else {
               Result.push(((c$1>>>12)|224));
               Result.push((((c$1>>>6)&63)|128));
               Result.push(((c$1&63)|128));
            }
         }
      }
      return Result
   }
   /// function TString.FromCharCode(const CharCode: Byte) : Char
   ///  [line: 1242, column: 24, file: System.Types]
   ,FromCharCode:function(Self, CharCode) {
      var Result = "";
      Result = String.fromCharCode(CharCode);
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TInteger = class (TObject)
///  [line: 459, column: 3, file: System.Types]
var TInteger = {
   $ClassName:"TInteger",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TInteger.Diff(const Primary: Integer; const Secondary: Integer) : Integer
   ///  [line: 2084, column: 25, file: System.Types]
   ,Diff:function(Primary, Secondary) {
      var Result = 0;
      if (Primary!=Secondary) {
         if (Primary>Secondary) {
            Result = Primary-Secondary;
         } else {
            Result = Secondary-Primary;
         }
         if (Result<0) {
            Result = (Result-1)^(-1);
         }
      } else {
         Result = 0;
      }
      return Result
   }
   /// function TInteger.EnsureRange(const aValue: Integer; const aMin: Integer; const aMax: Integer) : Integer
   ///  [line: 2038, column: 25, file: System.Types]
   ,EnsureRange:function(aValue$5, aMin, aMax) {
      return ClampInt(aValue$5,aMin,aMax);
   }
   /// procedure TInteger.SetBit(index: Integer; aValue: Boolean; var buffer: Integer)
   ///  [line: 1953, column: 26, file: System.Types]
   ,SetBit:function(index, aValue$6, buffer$1) {
      if (index>=0&&index<=31) {
         if (aValue$6) {
            buffer$1.v = buffer$1.v|(1<<index);
         } else {
            buffer$1.v = buffer$1.v&(~(1<<index));
         }
      } else {
         throw Exception.Create($New(Exception),"Invalid bit index, expected 0..31");
      }
   }
   /// function TInteger.SubtractSmallest(const First: Integer; const Second: Integer) : Integer
   ///  [line: 2010, column: 25, file: System.Types]
   ,SubtractSmallest:function(First, Second) {
      var Result = 0;
      if (First<Second) {
         Result = Second-First;
      } else {
         Result = First-Second;
      }
      return Result
   }
   /// function TInteger.ToNearest(const Value: Integer; const Factor: Integer) : Integer
   ///  [line: 2069, column: 25, file: System.Types]
   ,ToNearest:function(Value, Factor) {
      var Result = 0;
      var FTemp = 0;
      Result = Value;
      FTemp = Value%Factor;
      if (FTemp>0) {
         (Result+= (Factor-FTemp));
      }
      return Result
   }
   /// function TInteger.WrapRange(const aValue: Integer; const aLowRange: Integer; const aHighRange: Integer) : Integer
   ///  [line: 2052, column: 25, file: System.Types]
   ,WrapRange:function(aValue$7, aLowRange, aHighRange) {
      var Result = 0;
      if (aValue$7>aHighRange) {
         Result = aLowRange+TInteger.Diff(aHighRange,(aValue$7-1));
         if (Result>aHighRange) {
            Result = TInteger.WrapRange(Result,aLowRange,aHighRange);
         }
      } else if (aValue$7<aLowRange) {
         Result = aHighRange-TInteger.Diff(aLowRange,(aValue$7+1));
         if (Result<aLowRange) {
            Result = TInteger.WrapRange(Result,aLowRange,aHighRange);
         }
      } else {
         Result = aValue$7;
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TFileAccessMode enumeration
///  [line: 133, column: 3, file: System.Types]
var TFileAccessMode = [ "fmOpenRead", "fmOpenWrite", "fmOpenReadWrite" ];
/// TEnumState enumeration
///  [line: 127, column: 3, file: System.Types]
var TEnumState = { 1:"esContinue", 0:"esAbort" };
/// TEnumResult enumeration
///  [line: 108, column: 3, file: System.Types]
var TEnumResult = { 160:"erContinue", 16:"erBreak" };
/// TDataTypeMap = record
///  [line: 500, column: 3, file: System.Types]
function Copy$TDataTypeMap(s,d) {
   d.Boolean=s.Boolean;
   d.Number$1=s.Number$1;
   d.String$1=s.String$1;
   d.Object$2=s.Object$2;
   d.Undefined=s.Undefined;
   d.Function$1=s.Function$1;
   return d;
}
function Clone$TDataTypeMap($) {
   return {
      Boolean:$.Boolean,
      Number$1:$.Number$1,
      String$1:$.String$1,
      Object$2:$.Object$2,
      Undefined:$.Undefined,
      Function$1:$.Function$1
   }
}
function GetIsRunningInBrowser() {
   var Result = false;
   Result = (!(typeof window === 'undefined'));
   return Result
};
/// EW3Exception = class (Exception)
///  [line: 228, column: 3, file: System.Types]
var EW3Exception = {
   $ClassName:"EW3Exception",$Parent:Exception
   ,$Init:function ($) {
      Exception.$Init($);
   }
   /// constructor EW3Exception.CreateFmt(aText: String; const aValues: array of const)
   ///  [line: 1765, column: 26, file: System.Types]
   ,CreateFmt:function(Self, aText, aValues) {
      Exception.Create(Self,Format(aText,aValues.slice(0)));
      return Self
   }
   /// constructor EW3Exception.Create(const MethodName: String; const Instance: TObject; const ErrorText: String)
   ///  [line: 1770, column: 26, file: System.Types]
   ,Create$20:function(Self, MethodName, Instance$3, ErrorText) {
      var LCallerName = "";
      LCallerName = (Instance$3)?TObject.ClassName(Instance$3.ClassType):"Anonymous";
      EW3Exception.CreateFmt(Self,$R[0],[MethodName, LCallerName, ErrorText]);
      return Self
   }
   ,Destroy:Exception.Destroy
};
/// EW3OwnedObject = class (EW3Exception)
///  [line: 347, column: 3, file: System.Types]
var EW3OwnedObject = {
   $ClassName:"EW3OwnedObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3LockError = class (EW3Exception)
///  [line: 339, column: 3, file: System.Types]
var EW3LockError = {
   $ClassName:"EW3LockError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function SetupTypeLUT() {
   __TYPE_MAP.Boolean = typeof(true);
   __TYPE_MAP.Number$1 = typeof(0);
   __TYPE_MAP.String$1 = typeof("");
   __TYPE_MAP.Object$2 = typeof(TVariant.CreateObject());
   __TYPE_MAP.Undefined = typeof(undefined);
   __TYPE_MAP.Function$1 = typeof(function () {
      /* null */
   });
};
/// TValuePrefixType enumeration
///  [line: 52, column: 3, file: System.Types.Convert]
var TValuePrefixType = [ "vpNone", "vpHexPascal", "vpHexC", "vpBinPascal", "vpBinC", "vpString" ];
/// TRTLDatatype enumeration
///  [line: 37, column: 3, file: System.Types.Convert]
var TRTLDatatype = [ "itUnknown", "itBoolean", "itByte", "itChar", "itWord", "itLong", "itInt16", "itInt32", "itFloat32", "itFloat64", "itString" ];
/// TDatatype = class (TObject)
///  [line: 66, column: 3, file: System.Types.Convert]
var TDatatype = {
   $ClassName:"TDatatype",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TDatatype.BooleanToBytes(const Value: Boolean) : TByteArray
   ///  [line: 850, column: 26, file: System.Types.Convert]
   ,BooleanToBytes:function(Self, Value$1) {
      var Result = [];
      if (Value$1) {
         Result.push(1);
      } else {
         Result.push(0);
      }
      return Result
   }
   /// function TDatatype.BytesToBase64(const Bytes: TByteArray) : String
   ///  [line: 798, column: 26, file: System.Types.Convert]
   ,BytesToBase64:function(Self, Bytes$1) {
      return TBase64EncDec.BytesToBase64$1(TBase64EncDec,Bytes$1);
   }
   /// function TDatatype.BytesToBoolean(const Data: TByteArray) : Boolean
   ///  [line: 1063, column: 26, file: System.Types.Convert]
   ,BytesToBoolean:function(Self, Data$3) {
      var Result = false;
      if (Data$3.length>=1) {
         Result = Data$3[0]>0;
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [Bool] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToFloat32(const Data: TByteArray) : Float
   ///  [line: 1031, column: 26, file: System.Types.Convert]
   ,BytesToFloat32:function(Self, Data$4) {
      var Result = 0;
      if (Data$4.length>=4) {
         __CONV_VIEW.setUint8(0,Data$4[0]);
         __CONV_VIEW.setUint8(1,Data$4[1]);
         __CONV_VIEW.setUint8(2,Data$4[2]);
         __CONV_VIEW.setUint8(3,Data$4[3]);
         Result = __CONV_VIEW.getFloat32(0,a$4);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [float32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToFloat64(const Data: TByteArray) : Float
   ///  [line: 1045, column: 26, file: System.Types.Convert]
   ,BytesToFloat64:function(Self, Data$5) {
      var Result = 0;
      if (Data$5.length>=8) {
         __CONV_VIEW.setUint8(0,Data$5[0]);
         __CONV_VIEW.setUint8(1,Data$5[1]);
         __CONV_VIEW.setUint8(2,Data$5[2]);
         __CONV_VIEW.setUint8(3,Data$5[3]);
         __CONV_VIEW.setUint8(4,Data$5[4]);
         __CONV_VIEW.setUint8(5,Data$5[5]);
         __CONV_VIEW.setUint8(6,Data$5[6]);
         __CONV_VIEW.setUint8(7,Data$5[7]);
         Result = __CONV_VIEW.getFloat64(0,a$4);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [float32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToInt16(const Data: TByteArray) : Integer
   ///  [line: 1019, column: 26, file: System.Types.Convert]
   ,BytesToInt16:function(Self, Data$6) {
      var Result = 0;
      if (Data$6.length>=2) {
         __CONV_VIEW.setUint8(0,Data$6[0]);
         __CONV_VIEW.setUint8(1,Data$6[1]);
         Result = __CONV_VIEW.getInt16(0,a$4);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [int16] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToInt32(const Data: TByteArray) : Integer
   ///  [line: 1005, column: 26, file: System.Types.Convert]
   ,BytesToInt32:function(Self, Data$7) {
      var Result = 0;
      if (Data$7.length>=4) {
         __CONV_VIEW.setUint8(0,Data$7[0]);
         __CONV_VIEW.setUint8(1,Data$7[1]);
         __CONV_VIEW.setUint8(2,Data$7[2]);
         __CONV_VIEW.setUint8(3,Data$7[3]);
         Result = __CONV_VIEW.getUint32(0,a$4);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [int32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToString(const Data: TByteArray) : String
   ///  [line: 838, column: 26, file: System.Types.Convert]
   ,BytesToString:function(Self, Data$8) {
      var Result = "";
      var x$4 = 0;
      var LChar = "";
      if (Data$8.length>0) {
         var $temp7;
         for(x$4=0,$temp7=Data$8.length;x$4<$temp7;x$4++) {
            LChar = TString.FromCharCode(TString,Data$8[x$4]);
            Result+=LChar;
         }
      }
      return Result
   }
   /// function TDatatype.BytesToTypedArray(const Values: TByteArray) : TMemoryHandle
   ///  [line: 808, column: 26, file: System.Types.Convert]
   ,BytesToTypedArray:function(Self, Values$1) {
      var Result = undefined;
      var LLen$4 = 0;
      LLen$4 = Values$1.length;
      if (LLen$4>0) {
         Result = new Uint8Array(LLen$4);
         (Result).set(Values$1,0);
      } else {
         Result = null;
      }
      return Result
   }
   /// function TDatatype.BytesToVariant(Data: TByteArray) : Variant
   ///  [line: 887, column: 26, file: System.Types.Convert]
   ,BytesToVariant:function(Self, Data$9) {
      var Result = undefined;
      switch (TDatatype.BytesToInt32(Self,Data$9)) {
         case 4027514882 :
            Data$9.splice(0,4)
            ;
            Result = TDatatype.BytesToBoolean(Self,Data$9);
            break;
         case 4027514883 :
            Data$9.splice(0,4)
            ;
            Result = Data$9[0];
            break;
         case 4027514884 :
            Data$9.splice(0,4)
            ;
            Result = TDatatype.BytesToInt16(Self,Data$9);
            break;
         case 4027514885 :
            Data$9.splice(0,4)
            ;
            Result = TDatatype.BytesToInt32(Self,Data$9);
            break;
         case 4027514886 :
            Data$9.splice(0,4)
            ;
            Result = TDatatype.BytesToFloat32(Self,Data$9);
            break;
         case 4027514887 :
            Data$9.splice(0,4)
            ;
            Result = TDatatype.BytesToFloat64(Self,Data$9);
            break;
         case 4027514888 :
            Data$9.splice(0,4)
            ;
            try {
               Result = TString.DecodeUTF8(TString,Data$9);
            } catch ($e) {
               var e = $W($e);
               throw Exception.Create($New(EW3Exception),e.FMessage);
            }
            break;
         default :
            throw Exception.Create($New(EDatatype),"Failed to convert bytes[] to intrinsic type, unknown identifier error");
      }
      return Result
   }
   /// function TDatatype.ByteToChar(const Value: Byte) : Char
   ///  [line: 768, column: 26, file: System.Types.Convert]
   ,ByteToChar:function(Self, Value$2) {
      var Result = "";
      Result = String.fromCharCode(Value$2);
      return Result
   }
   /// function TDatatype.CharToByte(const Value: Char) : Word
   ///  [line: 775, column: 26, file: System.Types.Convert]
   ,CharToByte:function(Self, Value$3) {
      var Result = 0;
      Result = (Value$3).charCodeAt(0);
      return Result
   }
   /// function TDatatype.CreateGUID() : String
   ///  [line: 572, column: 26, file: System.Types.Convert]
   ,CreateGUID:function(Self) {
      var Result = "";
      var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    Result = s.join("");
      Result = (Result).toUpperCase();
      return Result
   }
   /// function TDatatype.Float32ToBytes(Value: float32) : TByteArray
   ///  [line: 858, column: 26, file: System.Types.Convert]
   ,Float32ToBytes:function(Self, Value$4) {
      var Result = [];
      __CONV_VIEW.setFloat32(0,Value$4,a$4);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      return Result
   }
   /// function TDatatype.Float64ToBytes(Value: float64) : TByteArray
   ///  [line: 867, column: 26, file: System.Types.Convert]
   ,Float64ToBytes:function(Self, Value$5) {
      var Result = [];
      __CONV_VIEW.setFloat64(0,Number(Value$5),a$4);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      Result.push(__CONV_VIEW.getUint8(4));
      Result.push(__CONV_VIEW.getUint8(5));
      Result.push(__CONV_VIEW.getUint8(6));
      Result.push(__CONV_VIEW.getUint8(7));
      return Result
   }
   /// function TDatatype.Int16ToBytes(Value: Integer) : TByteArray
   ///  [line: 880, column: 26, file: System.Types.Convert]
   ,Int16ToBytes:function(Self, Value$6) {
      var Result = [];
      __CONV_VIEW.setInt16(0,Value$6,a$4);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      return Result
   }
   /// function TDatatype.Int32ToBytes(Value: Integer) : TByteArray
   ///  [line: 996, column: 26, file: System.Types.Convert]
   ,Int32ToBytes:function(Self, Value$7) {
      var Result = [];
      __CONV_VIEW.setUint32(0,Value$7,a$4);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      return Result
   }
   /// function TDatatype.SizeOfType(const Kind: TRTLDatatype) : Integer
   ///  [line: 542, column: 26, file: System.Types.Convert]
   ,SizeOfType:function(Self, Kind) {
      return __SIZES[Kind];
   }
   /// function TDatatype.StringToBytes(const Value: String) : TByteArray
   ///  [line: 822, column: 26, file: System.Types.Convert]
   ,StringToBytes:function(Self, Value$8) {
      var Result = [];
      var LLen$5 = 0,
         x$5 = 0;
      var LCode = 0;
      LLen$5 = Value$8.length;
      if (LLen$5>0) {
         var $temp8;
         for(x$5=0,$temp8=LLen$5;x$5<$temp8;x$5++) {
            LCode = 0;
            LCode = (Value$8).charCodeAt(x$5);
            Result.push(LCode);
         }
      }
      return Result
   }
   /// function TDatatype.TypedArrayToBytes(const Value: TDefaultBufferType) : TByteArray
   ///  [line: 589, column: 27, file: System.Types.Convert]
   ,TypedArrayToBytes:function(Self, Value$9) {
      var Result = [];
      if (TVariant.ValidRef(Value$9)) {
         Result = Array.prototype.slice.call(Value$9);
      }
      return Result
   }
   /// function TDatatype.TypedArrayToStr(const Value: TDefaultBufferType) : String
   ///  [line: 635, column: 26, file: System.Types.Convert]
   ,TypedArrayToStr:function(Self, Value$10) {
      var Result = "";
      var x$6 = 0;
      if (TVariant.ValidRef(Value$10)) {
         if (Value$10.length>0) {
            var $temp9;
            for(x$6=0,$temp9=Value$10.length;x$6<$temp9;x$6++) {
               Result += String.fromCharCode((Value$10)[x$6]);
            }
         }
      }
      return Result
   }
   /// function TDatatype.TypedArrayToUInt32(const Value: TDefaultBufferType) : Integer
   ///  [line: 625, column: 26, file: System.Types.Convert]
   ,TypedArrayToUInt32:function(Self, Value$11) {
      var Result = 0;
      var mTemp = null;
      mTemp = new Uint32Array((Value$11).buffer);
      Result = mTemp[0];
      return Result
   }
   /// function TDatatype.VariantToBytes(Value: Variant) : TByteArray
   ///  [line: 938, column: 26, file: System.Types.Convert]
   ,VariantToBytes:function(Self, Value$12) {
      var Result = [];
      var chunk = [];
      function IsFloat32(x$7) {
         var Result = false;
         Result = isFinite(x$7) && x$7 == Math.fround(x$7);
         return Result
      };
      switch (TW3VariantHelper$DataType(Value$12)) {
         case 2 :
            Result = TDatatype.Int32ToBytes(Self,4027514882);
            Result.pusha(TDatatype.BooleanToBytes(Self,(Value$12?true:false)));
            break;
         case 3 :
            if (Value$12>=0&&Value$12<=255) {
               Result = TDatatype.Int32ToBytes(Self,4027514883);
               Result.push(parseInt(Value$12,10));
            } else if (Value$12>=0&&Value$12<65536) {
               Result = TDatatype.Int32ToBytes(Self,4027514884);
               Result.pusha(TDatatype.Int16ToBytes(Self,parseInt(Value$12,10)));
            } else {
               Result = TDatatype.Int32ToBytes(Self,4027514885);
               Result.pusha(TDatatype.Int32ToBytes(Self,parseInt(Value$12,10)));
            }
            break;
         case 4 :
            if (IsFloat32(Value$12)) {
               Result = TDatatype.Int32ToBytes(Self,4027514886);
               Result.pusha(TDatatype.Float32ToBytes(Self,Number(Value$12)));
            } else {
               Result = TDatatype.Int32ToBytes(Self,4027514887);
               Result.pusha(TDatatype.Float64ToBytes(Self,Number(Value$12)));
            }
            break;
         case 5 :
            Result = TDatatype.Int32ToBytes(Self,4027514888);
            chunk = TString.EncodeUTF8(TString,String(Value$12));
            Result.pusha(chunk);
            break;
         default :
            throw Exception.Create($New(EDatatype),"Invalid datatype, byte conversion failed error");
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TBase64EncDec = class (TObject)
///  [line: 188, column: 3, file: System.Types.Convert]
var TBase64EncDec = {
   $ClassName:"TBase64EncDec",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TBase64EncDec.Base64ToString(const b64: String) : String
   ///  [line: 325, column: 30, file: System.Types.Convert]
   ,Base64ToString:function(Self, b64) {
      var Result = "";
      Result = atob(b64);
      return Result
   }
   /// function TBase64EncDec.BytesToBase64(const Data: TByteArray) : String
   ///  [line: 429, column: 30, file: System.Types.Convert]
   ,BytesToBase64$1:function(Self, Data$10) {
      var Result = "";
      var LParts = [],
         LLen$6 = 0,
         LExtra = 0,
         LStrideLen = 0,
         LMaxChunkLength = 0,
         i$1 = 0,
         Ahead = 0,
         SegSize = 0,
         output = "",
         LTemp = 0,
         LTemp$1 = 0;
      LLen$6 = Data$10.length;
      if (LLen$6>0) {
         LExtra = Data$10.length%3;
         LStrideLen = LLen$6-LExtra;
         LMaxChunkLength = 16383;
         i$1 = 0;
         while (i$1<LStrideLen) {
            Ahead = i$1+LMaxChunkLength;
            SegSize = (Ahead>LStrideLen)?LStrideLen:Ahead;
            LParts.push(TBase64EncDec.EncodeChunk(Self,Data$10,i$1,SegSize));
            (i$1+= LMaxChunkLength);
         }
         if (LExtra>0) {
            --LLen$6;
         }
         output = "";
         switch (LExtra) {
            case 1 :
               LTemp = Data$10[LLen$6];
               output+=__B64_Lookup[LTemp>>>2];
               output+=__B64_Lookup[(LTemp<<4)&63];
               output+="==";
               break;
            case 2 :
               LTemp$1 = (Data$10[LLen$6-1]<<8)+Data$10[LLen$6];
               output+=__B64_Lookup[LTemp$1>>>10];
               output+=__B64_Lookup[(LTemp$1>>>4)&63];
               output+=__B64_Lookup[(LTemp$1<<2)&63];
               output+="=";
               break;
         }
         LParts.push(output);
         Result = (LParts).join("");
      }
      return Result
   }
   /// function TBase64EncDec.EncodeChunk(const Data: TByteArray; startpos: Integer; endpos: Integer) : String
   ///  [line: 340, column: 30, file: System.Types.Convert]
   ,EncodeChunk:function(Self, Data$11, startpos, endpos) {
      var Result = "";
      var temp = 0;
      var output$1 = [];
      while (startpos<endpos) {
         temp = (Data$11[startpos]<<16)+(Data$11[startpos+1]<<8)+Data$11[startpos+2];
         output$1.push(TBase64EncDec.TripletToBase64(Self,temp));
         (startpos+= 3);
      }
      Result = (output$1).join("");
      return Result
   }
   /// function TBase64EncDec.StringToBase64(const Text: String) : String
   ///  [line: 318, column: 30, file: System.Types.Convert]
   ,StringToBase64:function(Self, Text$1) {
      var Result = "";
      Result = btoa(Text$1);
      return Result
   }
   /// function TBase64EncDec.TripletToBase64(const num: Integer) : String
   ///  [line: 332, column: 30, file: System.Types.Convert]
   ,TripletToBase64:function(Self, num) {
      return __B64_Lookup[(num>>>18)&63]+__B64_Lookup[(num>>>12)&63]+__B64_Lookup[(num>>>6)&63]+__B64_Lookup[num&63];
   }
   ,Destroy:TObject.Destroy
};
/// EDatatype = class (EW3Exception)
///  [line: 21, column: 3, file: System.Types.Convert]
var EDatatype = {
   $ClassName:"EDatatype",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function SetupConversionLUT() {
   try {
      __CONV_BUFFER = new ArrayBuffer(16);
      __CONV_VIEW   = new DataView(__CONV_BUFFER);
      __CONV_ARRAY = new Uint8Array(__CONV_BUFFER,0,15);
   } catch ($e) {
      var e$1 = $W($e);
      /* null */
   }
};
function SetupBase64() {
   var i$2 = 0;
   var $temp10;
   for(i$2=1,$temp10=CNT_B64_CHARSET.length;i$2<=$temp10;i$2++) {
      __B64_Lookup[i$2-1] = CNT_B64_CHARSET.charAt(i$2-1);
      __B64_RevLookup[TDatatype.CharToByte(TDatatype,CNT_B64_CHARSET.charAt(i$2-1))] = i$2-1;
   }
   __B64_RevLookup[TDatatype.CharToByte(TDatatype,"-")] = 62;
   __B64_RevLookup[TDatatype.CharToByte(TDatatype,"_")] = 63;
};
/// TUnManaged = class (TObject)
///  [line: 113, column: 3, file: System.Memory]
var TUnManaged = {
   $ClassName:"TUnManaged",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TUnManaged.AllocMemA(const Size: Integer) : TMemoryHandle
   ///  [line: 252, column: 27, file: System.Memory]
   ,AllocMemA:function(Self, Size$5) {
      var Result = undefined;
      if (Size$5>0) {
         Result = new Uint8Array(Size$5);
      } else {
         Result = null;
      }
      return Result
   }
   /// function TUnManaged.ReAllocMemA(const Memory: TMemoryHandle; Size: Integer) : TMemoryHandle
   ///  [line: 271, column: 27, file: System.Memory]
   ,ReAllocMemA:function(Self, Memory$1, Size$6) {
      var Result = undefined;
      if (Memory$1) {
         if (Size$6>0) {
            Result = new Uint8Array(Size$6);
            TMarshal.Move$1(TMarshal,Memory$1,0,Result,0,Size$6);
         }
      } else {
         Result = TUnManaged.AllocMemA(Self,Size$6);
      }
      return Result
   }
   /// function TUnManaged.ReadMemoryA(const Memory: TMemoryHandle; const Offset: Integer; Size: Integer) : TMemoryHandle
   ///  [line: 354, column: 27, file: System.Memory]
   ,ReadMemoryA:function(Self, Memory$2, Offset, Size$7) {
      var Result = undefined;
      var mTotal = 0;
      if (Memory$2&&Offset>=0) {
         mTotal = Offset+Size$7;
         if (mTotal>Memory$2.length) {
            Size$7 = parseInt((Memory$2.length-mTotal),10);
         }
         if (Size$7>0) {
            Result = new Uint8Array(Memory$2.buffer.slice(Offset,Size$7));
         }
      }
      return Result
   }
   /// function TUnManaged.WriteMemoryA(const Memory: TMemoryHandle; const Offset: Integer; const Data: TMemoryHandle) : Integer
   ///  [line: 320, column: 27, file: System.Memory]
   ,WriteMemoryA:function(Self, Memory$3, Offset$1, Data$12) {
      var Result = 0;
      var mTotal$1,
         mChunk = null,
         mTemp$1 = null;
      if (Memory$3) {
         if (Data$12) {
            mTotal$1 = Offset$1+Data$12.length;
            if (mTotal$1>Memory$3.length) {
               Result = parseInt((Memory$3.length-mTotal$1),10);
            } else {
               Result = parseInt(Data$12.length,10);
            }
            if (Result>0) {
               if (Offset$1+Data$12.length<=Memory$3.length) {
                  Memory$3.set(Data$12,Offset$1);
               } else {
                  mChunk = Data$12.buffer.slice(0,Result-1);
                  mTemp$1 = new Uint8Array(mChunk);
                  Memory$3.set(mTemp$1,Offset$1);
               }
            }
         }
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// function TMemoryHandleHelper.Valid(const Self: TMemoryHandle) : Boolean
///  [line: 219, column: 30, file: System.Memory]
function TMemoryHandleHelper$Valid$3(Self$8) {
   var Result = false;
   Result = !( (Self$8 == undefined) || (Self$8 == null) );
   return Result
}
/// function TMemoryHandleHelper.Defined(const Self: TMemoryHandle) : Boolean
///  [line: 226, column: 30, file: System.Memory]
function TMemoryHandleHelper$Defined(Self$9) {
   var Result = false;
   Result = !(Self$9 == undefined);
   return Result
}
/// TMarshal = class (TObject)
///  [line: 140, column: 3, file: System.Memory]
var TMarshal = {
   $ClassName:"TMarshal",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// procedure TMarshal.Move(const Source: TMemoryHandle; const SourceStart: Integer; const Target: TMemoryHandle; const TargetStart: Integer; const Size: Integer)
   ///  [line: 560, column: 26, file: System.Memory]
   ,Move$1:function(Self, Source, SourceStart, Target, TargetStart, Size$8) {
      var mRef = null;
      if (TMemoryHandleHelper$Defined(Source)&&TMemoryHandleHelper$Valid$3(Source)&&SourceStart>=0) {
         if (TMemoryHandleHelper$Defined(Target)&&TMemoryHandleHelper$Valid$3(Target)&&TargetStart>=0) {
            mRef = Source.subarray(SourceStart,SourceStart+Size$8);
            Target.set(mRef,TargetStart);
         }
      }
   }
   /// procedure TMarshal.Move(const Source: TAddress; const Target: TAddress; const Size: Integer)
   ///  [line: 591, column: 26, file: System.Memory]
   ,Move:function(Self, Source$1, Target$1, Size$9) {
      if (Source$1!==null) {
         if (Target$1!==null) {
            if (Size$9>0) {
               TMarshal.Move$1(Self,Source$1.FBuffer,Source$1.FOffset$1,Target$1.FBuffer,Target$1.FOffset$1,Size$9);
            }
         }
      }
   }
   ,Destroy:TObject.Destroy
};
/// function TBufferHandleHelper.Valid(const Self: TBufferHandle) : Boolean
///  [line: 187, column: 30, file: System.Memory]
function TBufferHandleHelper$Valid$4(Self$10) {
   var Result = false;
   Result = !( (Self$10 == undefined) || (Self$10 == null) );
   return Result
}
/// TAddress = class (TObject)
///  [line: 71, column: 3, file: System.Streams]
var TAddress = {
   $ClassName:"TAddress",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FBuffer = undefined;
      $.FOffset$1 = 0;
   }
   /// constructor TAddress.Create(const Memory: TBinaryData)
   ///  [line: 220, column: 22, file: System.Memory.Buffer]
   ,Create$23:function(Self, Memory$4) {
      if (Memory$4!==null&&TAllocation.GetSize$3(Memory$4)>0) {
         TAddress.Create$21(Self,TAllocation.GetHandle(Memory$4),0);
      } else {
         throw Exception.Create($New(Exception),"Invalid memory object error");
      }
      return Self
   }
   /// constructor TAddress.Create(const Stream: TStream)
   ///  [line: 224, column: 22, file: System.Streams]
   ,Create$22:function(Self, Stream) {
      var mRef$1 = undefined;
      if ($Is(Stream,TMemoryStream)) {
         mRef$1 = TAllocation.GetHandle($As(Stream,TMemoryStream).FBuffer$1);
         if (mRef$1) {
            TAddress.Create$21(Self,mRef$1,0);
         } else {
            throw Exception.Create($New(EAddress),$R[3]);
         }
      } else {
         throw Exception.Create($New(EAddress),$R[4]);
      }
      return Self
   }
   /// constructor TAddress.Create(const Segment: TBufferHandle; const Offset: Integer)
   ///  [line: 651, column: 22, file: System.Memory]
   ,Create$21:function(Self, Segment$1, Offset$2) {
      TObject.Create(Self);
      if (Segment$1&&TBufferHandleHelper$Valid$4(Segment$1)) {
         Self.FBuffer = Segment$1;
      } else {
         throw Exception.Create($New(EAddress),"Failed to derive address, invalid segment error");
      }
      if (Offset$2>=0) {
         Self.FOffset$1 = Offset$2;
      } else {
         throw Exception.Create($New(EAddress),"Failed to derive address, invalid offset error");
      }
      return Self
   }
   /// destructor TAddress.Destroy()
   ///  [line: 665, column: 21, file: System.Memory]
   ,Destroy:function(Self) {
      Self.FBuffer = null;
      Self.FOffset$1 = 0;
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// EAddress = class (EW3Exception)
///  [line: 94, column: 3, file: System.Memory]
var EAddress = {
   $ClassName:"EAddress",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TStream = class (TObject)
///  [line: 80, column: 3, file: System.Streams]
var TStream = {
   $ClassName:"TStream",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TStream.CopyFrom(const Source: TStream; Count: Integer) : Integer
   ///  [line: 469, column: 18, file: System.Streams]
   ,CopyFrom:function(Self, Source$2, Count$4) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.DataGetSize() : Integer
   ///  [line: 435, column: 18, file: System.Streams]
   ,DataGetSize:function(Self) {
      return TStream.GetSize$1$(Self);
   }
   /// function TStream.DataOffset() : Integer
   ///  [line: 429, column: 18, file: System.Streams]
   ,DataOffset:function(Self) {
      return TStream.GetPosition$(Self);
   }
   /// function TStream.DataRead(const Offset: Integer; const ByteCount: Integer) : TByteArray
   ///  [line: 441, column: 19, file: System.Streams]
   ,DataRead:function(Self, Offset$3, ByteCount) {
      return TStream.ReadBuffer$(Self,Offset$3,ByteCount);
   }
   /// procedure TStream.DataWrite(const Offset: Integer; const Bytes: TByteArray)
   ///  [line: 447, column: 19, file: System.Streams]
   ,DataWrite:function(Self, Offset$4, Bytes$2) {
      TStream.WriteBuffer$(Self,Bytes$2,Offset$4);
   }
   /// function TStream.GetPosition() : Integer
   ///  [line: 475, column: 18, file: System.Streams]
   ,GetPosition:function(Self) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.GetSize() : Integer
   ///  [line: 497, column: 18, file: System.Streams]
   ,GetSize$1:function(Self) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Read(const Count: Integer) : TByteArray
   ///  [line: 452, column: 18, file: System.Streams]
   ,Read:function(Self, Count$5) {
      return TStream.ReadBuffer$(Self,TStream.GetPosition$(Self),Count$5);
   }
   /// function TStream.ReadBuffer(Offset: Integer; Count: Integer) : TByteArray
   ///  [line: 509, column: 18, file: System.Streams]
   ,ReadBuffer:function(Self, Offset$5, Count$6) {
      var Result = [];
      Result.length=0;
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Seek(const Offset: Integer; Origin: TStreamSeekOrigin) : Integer
   ///  [line: 491, column: 18, file: System.Streams]
   ,Seek:function(Self, Offset$6, Origin) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
      return Result
   }
   /// procedure TStream.SetPosition(NewPosition: Integer)
   ///  [line: 481, column: 19, file: System.Streams]
   ,SetPosition:function(Self, NewPosition) {
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
   }
   /// procedure TStream.SetSize(NewSize: Integer)
   ///  [line: 486, column: 19, file: System.Streams]
   ,SetSize:function(Self, NewSize) {
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
   }
   /// function TStream.Skip(Amount: Integer) : Integer
   ///  [line: 503, column: 18, file: System.Streams]
   ,Skip:function(Self, Amount) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Write(const Buffer: TByteArray) : Integer
   ///  [line: 457, column: 18, file: System.Streams]
   ,Write$1:function(Self, Buffer$2) {
      var Result = 0;
      TStream.WriteBuffer$(Self,Buffer$2,TStream.GetPosition$(Self));
      Result = Buffer$2.length;
      return Result
   }
   /// procedure TStream.WriteBuffer(const Buffer: TByteArray; Offset: Integer)
   ///  [line: 515, column: 19, file: System.Streams]
   ,WriteBuffer:function(Self, Buffer$3, Offset$7) {
      throw Exception.Create($New(EStreamNotImplemented),$R[5]);
   }
   ,Destroy:TObject.Destroy
   ,CopyFrom$:function($){return $.ClassType.CopyFrom.apply($.ClassType, arguments)}
   ,GetPosition$:function($){return $.ClassType.GetPosition($)}
   ,GetSize$1$:function($){return $.ClassType.GetSize$1($)}
   ,ReadBuffer$:function($){return $.ClassType.ReadBuffer.apply($.ClassType, arguments)}
   ,Seek$:function($){return $.ClassType.Seek.apply($.ClassType, arguments)}
   ,SetPosition$:function($){return $.ClassType.SetPosition.apply($.ClassType, arguments)}
   ,SetSize$:function($){return $.ClassType.SetSize.apply($.ClassType, arguments)}
   ,Skip$:function($){return $.ClassType.Skip.apply($.ClassType, arguments)}
   ,WriteBuffer$:function($){return $.ClassType.WriteBuffer.apply($.ClassType, arguments)}
};
TStream.$Intf={
   IBinaryTransport:[TStream.DataOffset,TStream.DataGetSize,TStream.DataRead,TStream.DataWrite]
}
/// TMemoryStream = class (TStream)
///  [line: 117, column: 3, file: System.Streams]
var TMemoryStream = {
   $ClassName:"TMemoryStream",$Parent:TStream
   ,$Init:function ($) {
      TStream.$Init($);
      $.FBuffer$1 = null;
      $.FPos = 0;
   }
   /// function TMemoryStream.CopyFrom(const Source: TStream; Count: Integer) : Integer
   ///  [line: 258, column: 24, file: System.Streams]
   ,CopyFrom:function(Self, Source$3, Count$7) {
      var Result = 0;
      var LData = [];
      LData = TStream.ReadBuffer$(Source$3,TStream.GetPosition$(Source$3),Count$7);
      TStream.WriteBuffer$(Self,LData,TStream.GetPosition$(Self));
      Result = LData.length;
      return Result
   }
   /// constructor TMemoryStream.Create()
   ///  [line: 246, column: 27, file: System.Streams]
   ,Create$24:function(Self) {
      TObject.Create(Self);
      Self.FBuffer$1 = TAllocation.Create$27($New(TAllocation));
      return Self
   }
   /// destructor TMemoryStream.Destroy()
   ///  [line: 252, column: 26, file: System.Streams]
   ,Destroy:function(Self) {
      TObject.Free(Self.FBuffer$1);
      TObject.Destroy(Self);
   }
   /// function TMemoryStream.GetPosition() : Integer
   ///  [line: 265, column: 24, file: System.Streams]
   ,GetPosition:function(Self) {
      return Self.FPos;
   }
   /// function TMemoryStream.GetSize() : Integer
   ///  [line: 340, column: 24, file: System.Streams]
   ,GetSize$1:function(Self) {
      return TAllocation.GetSize$3(Self.FBuffer$1);
   }
   /// function TMemoryStream.ReadBuffer(Offset: Integer; Count: Integer) : TByteArray
   ///  [line: 361, column: 24, file: System.Streams]
   ,ReadBuffer:function(Self, Offset$8, Count$8) {
      var Result = [];
      var mTemp$2 = undefined;
      var mLen = 0;
      var LBytesToMove = 0;
      if (TStream.GetPosition$(Self)<TStream.GetSize$1$(Self)) {
         mLen = TStream.GetSize$1$(Self)-TStream.GetPosition$(Self);
      } else {
         mLen = 0;
      }
      if (mLen>0) {
         try {
            LBytesToMove = Count$8;
            if (LBytesToMove>mLen) {
               LBytesToMove = mLen;
            }
            mTemp$2 = new Uint8Array(LBytesToMove);
            TMarshal.Move$1(TMarshal,TAllocation.GetHandle(Self.FBuffer$1),Offset$8,mTemp$2,0,LBytesToMove);
            Result = TDatatype.TypedArrayToBytes(TDatatype,mTemp$2);
            TStream.SetPosition$(Self,Offset$8+Result.length);
         } catch ($e) {
            var e$2 = $W($e);
            throw EW3Exception.CreateFmt($New(EStreamReadError),$R[8],[e$2.FMessage]);
         }
      }
      return Result
   }
   /// function TMemoryStream.Seek(const Offset: Integer; Origin: TStreamSeekOrigin) : Integer
   ///  [line: 310, column: 24, file: System.Streams]
   ,Seek:function(Self, Offset$9, Origin$1) {
      var Result = 0;
      var mSize = 0;
      mSize = TStream.GetSize$1$(Self);
      if (mSize>0) {
         switch (Origin$1) {
            case 0 :
               if (Offset$9>-1) {
                  TStream.SetPosition$(Self,Offset$9);
                  Result = Offset$9;
               }
               break;
            case 1 :
               Result = TInteger.EnsureRange((TStream.GetPosition$(Self)+Offset$9),0,mSize);
               TStream.SetPosition$(Self,Result);
               break;
            case 2 :
               Result = TInteger.EnsureRange((TStream.GetSize$1$(Self)-Math.abs(Offset$9)),0,mSize);
               TStream.SetPosition$(Self,Result);
               break;
         }
      }
      return Result
   }
   /// procedure TMemoryStream.SetPosition(NewPosition: Integer)
   ///  [line: 270, column: 25, file: System.Streams]
   ,SetPosition:function(Self, NewPosition$1) {
      var LSize = 0;
      LSize = TStream.GetSize$1$(Self);
      if (LSize>0) {
         Self.FPos = TInteger.EnsureRange(NewPosition$1,0,LSize);
      }
   }
   /// procedure TMemoryStream.SetSize(NewSize: Integer)
   ///  [line: 277, column: 25, file: System.Streams]
   ,SetSize:function(Self, NewSize$1) {
      var mSize$1 = 0;
      var mDiff = 0;
      mSize$1 = TStream.GetSize$1$(Self);
      if (NewSize$1>0) {
         if (NewSize$1>mSize$1) {
            mDiff = NewSize$1-mSize$1;
            if (TAllocation.GetSize$3(Self.FBuffer$1)+mDiff>0) {
               TAllocation.Grow(Self.FBuffer$1,mDiff);
            } else {
               TAllocation.Release$2(Self.FBuffer$1);
            }
         } else {
            mDiff = mSize$1-NewSize$1;
            if (TAllocation.GetSize$3(Self.FBuffer$1)-mDiff>0) {
               TAllocation.Shrink(Self.FBuffer$1,mDiff);
            } else {
               TAllocation.Release$2(Self.FBuffer$1);
            }
         }
      } else {
         TAllocation.Release$2(Self.FBuffer$1);
      }
      Self.FPos = TInteger.EnsureRange(Self.FPos,0,TStream.GetSize$1$(Self));
   }
   /// function TMemoryStream.Skip(Amount: Integer) : Integer
   ///  [line: 345, column: 24, file: System.Streams]
   ,Skip:function(Self, Amount$1) {
      var Result = 0;
      var mTotal$2 = 0;
      var mSize$2 = 0;
      mSize$2 = TStream.GetSize$1$(Self);
      if (mSize$2>0) {
         mTotal$2 = TStream.GetPosition$(Self)+Amount$1;
         if (mTotal$2>mSize$2) {
            mTotal$2 = mSize$2-mTotal$2;
         }
         (Self.FPos+= mTotal$2);
         Result = mTotal$2;
      }
      return Result
   }
   /// procedure TMemoryStream.WriteBuffer(const Buffer: TByteArray; Offset: Integer)
   ///  [line: 393, column: 25, file: System.Streams]
   ,WriteBuffer:function(Self, Buffer$4, Offset$10) {
      var mData = undefined;
      try {
         if (TAllocation.a$28(Self.FBuffer$1)&&Offset$10<1) {
            TAllocation.Allocate$1(Self.FBuffer$1,Buffer$4.length);
            mData = TDatatype.BytesToTypedArray(TDatatype,Buffer$4);
            TMarshal.Move$1(TMarshal,mData,0,TAllocation.GetHandle(Self.FBuffer$1),0,Buffer$4.length);
         } else {
            if (TStream.GetPosition$(Self)==TStream.GetSize$1$(Self)) {
               TAllocation.Grow(Self.FBuffer$1,Buffer$4.length);
               mData = TDatatype.BytesToTypedArray(TDatatype,Buffer$4);
               TMarshal.Move$1(TMarshal,mData,0,TAllocation.GetHandle(Self.FBuffer$1),Offset$10,Buffer$4.length);
            } else {
               TMarshal.Move$1(TMarshal,TDatatype.BytesToTypedArray(TDatatype,Buffer$4),0,TAllocation.GetHandle(Self.FBuffer$1),Offset$10,Buffer$4.length);
            }
         }
         TStream.SetPosition$(Self,Offset$10+Buffer$4.length);
      } catch ($e) {
         var e$3 = $W($e);
         throw EW3Exception.CreateFmt($New(EStreamWriteError),$R[7],[e$3.FMessage]);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,CopyFrom$:function($){return $.ClassType.CopyFrom.apply($.ClassType, arguments)}
   ,GetPosition$:function($){return $.ClassType.GetPosition($)}
   ,GetSize$1$:function($){return $.ClassType.GetSize$1($)}
   ,ReadBuffer$:function($){return $.ClassType.ReadBuffer.apply($.ClassType, arguments)}
   ,Seek$:function($){return $.ClassType.Seek.apply($.ClassType, arguments)}
   ,SetPosition$:function($){return $.ClassType.SetPosition.apply($.ClassType, arguments)}
   ,SetSize$:function($){return $.ClassType.SetSize.apply($.ClassType, arguments)}
   ,Skip$:function($){return $.ClassType.Skip.apply($.ClassType, arguments)}
   ,WriteBuffer$:function($){return $.ClassType.WriteBuffer.apply($.ClassType, arguments)}
};
TMemoryStream.$Intf={
   IBinaryTransport:[TStream.DataOffset,TStream.DataGetSize,TStream.DataRead,TStream.DataWrite]
}
/// TStreamSeekOrigin enumeration
///  [line: 48, column: 3, file: System.Streams]
var TStreamSeekOrigin = [ "soFromBeginning", "soFromCurrent", "soFromEnd" ];
/// TCustomFileStream = class (TStream)
///  [line: 147, column: 3, file: System.Streams]
var TCustomFileStream = {
   $ClassName:"TCustomFileStream",$Parent:TStream
   ,$Init:function ($) {
      TStream.$Init($);
      $.FAccess$1 = 0;
      $.FFilename = "";
   }
   /// procedure TCustomFileStream.SetAccessMode(const Value: TFileAccessMode)
   ///  [line: 210, column: 29, file: System.Streams]
   ,SetAccessMode:function(Self, Value$13) {
      Self.FAccess$1 = Value$13;
   }
   /// procedure TCustomFileStream.SetFilename(const Value: String)
   ///  [line: 215, column: 29, file: System.Streams]
   ,SetFilename:function(Self, Value$14) {
      Self.FFilename = Value$14;
   }
   ,Destroy:TObject.Destroy
   ,CopyFrom:TStream.CopyFrom
   ,GetPosition:TStream.GetPosition
   ,GetSize$1:TStream.GetSize$1
   ,ReadBuffer:TStream.ReadBuffer
   ,Seek:TStream.Seek
   ,SetPosition:TStream.SetPosition
   ,SetSize:TStream.SetSize
   ,Skip:TStream.Skip
   ,WriteBuffer:TStream.WriteBuffer
   ,Create$25$:function($){return $.ClassType.Create$25.apply($.ClassType, arguments)}
};
TCustomFileStream.$Intf={
   IBinaryTransport:[TStream.DataOffset,TStream.DataGetSize,TStream.DataRead,TStream.DataWrite]
}
/// EStream = class (EW3Exception)
///  [line: 56, column: 3, file: System.Streams]
var EStream = {
   $ClassName:"EStream",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EStreamWriteError = class (EStream)
///  [line: 58, column: 3, file: System.Streams]
var EStreamWriteError = {
   $ClassName:"EStreamWriteError",$Parent:EStream
   ,$Init:function ($) {
      EStream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EStreamReadError = class (EStream)
///  [line: 57, column: 3, file: System.Streams]
var EStreamReadError = {
   $ClassName:"EStreamReadError",$Parent:EStream
   ,$Init:function ($) {
      EStream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EStreamNotImplemented = class (EStream)
///  [line: 59, column: 3, file: System.Streams]
var EStreamNotImplemented = {
   $ClassName:"EStreamNotImplemented",$Parent:EStream
   ,$Init:function ($) {
      EStream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TAllocationOptions = class (TW3OwnedObject)
///  [line: 100, column: 3, file: System.Memory.Allocation]
var TAllocationOptions = {
   $ClassName:"TAllocationOptions",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FCacheSize = 0;
      $.FUseCache = false;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 113, column: 41, file: System.Memory.Allocation]
   ,a$27:function(Self) {
      return $As(TW3OwnedObject.GetOwner(Self),TAllocation);
   }
   /// function TAllocationOptions.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 134, column: 29, file: System.Memory.Allocation]
   ,AcceptOwner:function(Self, CandidateObject$1) {
      return CandidateObject$1!==null&&$Is(CandidateObject$1,TAllocation);
   }
   /// constructor TAllocationOptions.Create(const AOwner: TAllocation)
   ///  [line: 127, column: 32, file: System.Memory.Allocation]
   ,Create$26:function(Self, AOwner$1) {
      TW3OwnedObject.Create$13(Self,AOwner$1);
      Self.FCacheSize = 4096;
      Self.FUseCache = true;
      return Self
   }
   /// function TAllocationOptions.GetCacheFree() : Integer
   ///  [line: 140, column: 29, file: System.Memory.Allocation]
   ,GetCacheFree:function(Self) {
      return Self.FCacheSize-TAllocationOptions.GetCacheUsed(Self);
   }
   /// function TAllocationOptions.GetCacheUsed() : Integer
   ///  [line: 145, column: 29, file: System.Memory.Allocation]
   ,GetCacheUsed:function(Self) {
      var Result = 0;
      if (Self.FUseCache) {
         Result = parseInt((Self.FCacheSize-(TAllocation.GetHandle(TAllocationOptions.a$27(Self)).length-TAllocation.GetSize$3(TAllocationOptions.a$27(Self)))),10);
      }
      return Result
   }
   /// procedure TAllocationOptions.SetCacheSize(const NewCacheSize: Integer)
   ///  [line: 156, column: 30, file: System.Memory.Allocation]
   ,SetCacheSize:function(Self, NewCacheSize) {
      if (NewCacheSize<1024) {
         Self.FCacheSize = 1024;
      } else if (NewCacheSize>1024000) {
         Self.FCacheSize = 1024000;
      } else {
         Self.FCacheSize = NewCacheSize;
      }
   }
   /// procedure TAllocationOptions.SetUseCache(const NewUseValue: Boolean)
   ///  [line: 151, column: 30, file: System.Memory.Allocation]
   ,SetUseCache:function(Self, NewUseValue) {
      Self.FUseCache = NewUseValue;
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$13:TW3OwnedObject.Create$13
};
TAllocationOptions.$Intf={
   IW3OwnedObjectAccess:[TAllocationOptions.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TAllocation = class (TObject)
///  [line: 51, column: 3, file: System.Memory.Allocation]
var TAllocation = {
   $ClassName:"TAllocation",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FHandle$1 = undefined;
      $.FOptions$1 = null;
      $.FSize = 0;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 73, column: 37, file: System.Memory.Allocation]
   ,a$28:function(Self) {
      return ((!Self.FHandle$1)?true:false);
   }
   /// procedure TAllocation.Allocate(const NumberOfBytes: Integer)
   ///  [line: 259, column: 23, file: System.Memory.Allocation]
   ,Allocate$1:function(Self, NumberOfBytes) {
      var NewSize$2 = 0;
      if (Self.FHandle$1) {
         TAllocation.Release$2(Self);
      }
      if (NumberOfBytes>0) {
         if (Self.FOptions$1.FUseCache) {
            NewSize$2 = TInteger.ToNearest(NumberOfBytes,Self.FOptions$1.FCacheSize);
         } else {
            NewSize$2 = NumberOfBytes;
         }
         Self.FHandle$1 = TUnManaged.AllocMemA(TUnManaged,NewSize$2);
         Self.FSize = NumberOfBytes;
         TAllocation.HandleAllocated$(Self);
      }
   }
   /// constructor TAllocation.Create(const ByteSize: Integer)
   ///  [line: 179, column: 25, file: System.Memory.Allocation]
   ,Create$28:function(Self, ByteSize$1) {
      TAllocation.Create$27(Self);
      if (ByteSize$1>0) {
         TAllocation.Allocate$1(Self,ByteSize$1);
      }
      return Self
   }
   /// constructor TAllocation.Create()
   ///  [line: 173, column: 25, file: System.Memory.Allocation]
   ,Create$27:function(Self) {
      TObject.Create(Self);
      Self.FOptions$1 = TAllocationOptions.Create$26($New(TAllocationOptions),Self);
      return Self
   }
   /// function TAllocation.DataGetSize() : Integer
   ///  [line: 230, column: 22, file: System.Memory.Allocation]
   ,DataGetSize$1:function(Self) {
      return TAllocation.GetSize$3(Self);
   }
   /// function TAllocation.DataOffset() : Integer
   ///  [line: 224, column: 22, file: System.Memory.Allocation]
   ,DataOffset$1:function(Self) {
      return 0;
   }
   /// function TAllocation.DataRead(const Offset: Integer; const ByteCount: Integer) : TByteArray
   ///  [line: 236, column: 22, file: System.Memory.Allocation]
   ,DataRead$1:function(Self, Offset$11, ByteCount$1) {
      var Result = [];
      var MemSlice = undefined;
      MemSlice = TUnManaged.ReadMemoryA(TUnManaged,TAllocation.GetHandle(Self),Offset$11,ByteCount$1);
      Result = TDatatype.TypedArrayToBytes(TDatatype,MemSlice);
      return Result
   }
   /// procedure TAllocation.DataWrite(const Offset: Integer; const Bytes: TByteArray)
   ///  [line: 244, column: 23, file: System.Memory.Allocation]
   ,DataWrite$1:function(Self, Offset$12, Bytes$3) {
      TUnManaged.WriteMemoryA(TUnManaged,TAllocation.GetHandle(Self),Offset$12,TDatatype.BytesToTypedArray(TDatatype,Bytes$3));
   }
   /// destructor TAllocation.Destroy()
   ///  [line: 186, column: 24, file: System.Memory.Allocation]
   ,Destroy:function(Self) {
      if (Self.FHandle$1) {
         TAllocation.Release$2(Self);
      }
      TObject.Free(Self.FOptions$1);
      TObject.Destroy(Self);
   }
   /// function TAllocation.GetBufferHandle() : TBufferHandle
   ///  [line: 426, column: 22, file: System.Memory.Allocation]
   ,GetBufferHandle:function(Self) {
      var Result = undefined;
      if (Self.FHandle$1) {
         Result = Self.FHandle$1.buffer;
      } else {
         Result = null;
      }
      return Result
   }
   /// function TAllocation.GetHandle() : TMemoryHandle
   ///  [line: 421, column: 22, file: System.Memory.Allocation]
   ,GetHandle:function(Self) {
      return Self.FHandle$1;
   }
   /// function TAllocation.GetSize() : Integer
   ///  [line: 416, column: 22, file: System.Memory.Allocation]
   ,GetSize$3:function(Self) {
      return Self.FSize;
   }
   /// function TAllocation.GetTotalSize() : Integer
   ///  [line: 410, column: 22, file: System.Memory.Allocation]
   ,GetTotalSize$1:function(Self) {
      var Result = 0;
      if (Self.FHandle$1) {
         Result = parseInt(Self.FHandle$1.length,10);
      }
      return Result
   }
   /// function TAllocation.GetTransport() : IBinaryTransport
   ///  [line: 194, column: 22, file: System.Memory.Allocation]
   ,GetTransport:function(Self) {
      return $AsIntf(Self,"IBinaryTransport");
   }
   /// procedure TAllocation.Grow(const NumberOfBytes: Integer)
   ///  [line: 296, column: 23, file: System.Memory.Allocation]
   ,Grow:function(Self, NumberOfBytes$1) {
      var ExactNewSize = 0,
         TotalNewSize = 0;
      if (Self.FHandle$1) {
         ExactNewSize = Self.FSize+NumberOfBytes$1;
         if (Self.FOptions$1.FUseCache) {
            if (NumberOfBytes$1<TAllocationOptions.GetCacheFree(Self.FOptions$1)) {
               (Self.FSize+= NumberOfBytes$1);
            } else {
               TotalNewSize = TInteger.ToNearest(ExactNewSize,Self.FOptions$1.FCacheSize);
               TAllocation.ReAllocate(Self,TotalNewSize);
               Self.FSize = ExactNewSize;
            }
         } else {
            TAllocation.ReAllocate(Self,ExactNewSize);
         }
      } else {
         TAllocation.Allocate$1(Self,NumberOfBytes$1);
      }
   }
   /// procedure TAllocation.HandleAllocated()
   ///  [line: 249, column: 23, file: System.Memory.Allocation]
   ,HandleAllocated:function(Self) {
      /* null */
   }
   /// procedure TAllocation.HandleReleased()
   ///  [line: 254, column: 23, file: System.Memory.Allocation]
   ,HandleReleased:function(Self) {
      /* null */
   }
   /// procedure TAllocation.ReAllocate(const NewSize: Integer)
   ///  [line: 375, column: 23, file: System.Memory.Allocation]
   ,ReAllocate:function(Self, NewSize$3) {
      var LSizeToSet = 0;
      if (NewSize$3>0) {
         if (Self.FHandle$1) {
            if (NewSize$3!=Self.FSize) {
               TAllocation.HandleReleased$(Self);
               if (Self.FOptions$1.FUseCache) {
                  LSizeToSet = TInteger.ToNearest(NewSize$3,Self.FOptions$1.FCacheSize);
               } else {
                  LSizeToSet = TInteger.ToNearest(NewSize$3,16);
               }
               Self.FHandle$1 = TUnManaged.ReAllocMemA(TUnManaged,Self.FHandle$1,LSizeToSet);
               Self.FSize = NewSize$3;
            }
         } else {
            TAllocation.Allocate$1(Self,NewSize$3);
         }
         TAllocation.HandleAllocated$(Self);
      } else {
         TAllocation.Release$2(Self);
      }
   }
   /// procedure TAllocation.Release()
   ///  [line: 285, column: 23, file: System.Memory.Allocation]
   ,Release$2:function(Self) {
      if (Self.FHandle$1) {
         Self.FHandle$1.buffer = null;
         Self.FHandle$1 = null;
         Self.FSize = 0;
         TAllocation.HandleReleased$(Self);
      }
   }
   /// procedure TAllocation.Shrink(const NumberOfBytes: Integer)
   ///  [line: 328, column: 23, file: System.Memory.Allocation]
   ,Shrink:function(Self, NumberOfBytes$2) {
      var ExactNewSize$1 = 0,
         Spare = 0,
         AlignedSize = 0;
      if (Self.FHandle$1) {
         ExactNewSize$1 = TInteger.EnsureRange((Self.FSize-NumberOfBytes$2),0,2147483647);
         if (Self.FOptions$1.FUseCache) {
            if (ExactNewSize$1>0) {
               Spare = ExactNewSize$1%Self.FOptions$1.FCacheSize;
               if (Spare>0) {
                  AlignedSize = ExactNewSize$1;
                  (AlignedSize+= (Self.FOptions$1.FCacheSize-Spare));
                  TAllocation.ReAllocate(Self,AlignedSize);
                  Self.FSize = ExactNewSize$1;
               } else {
                  Self.FSize = ExactNewSize$1;
               }
            } else {
               TAllocation.Release$2(Self);
            }
         } else if (ExactNewSize$1>0) {
            TAllocation.ReAllocate(Self,ExactNewSize$1);
         } else {
            TAllocation.Release$2(Self);
         }
      }
   }
   /// procedure TAllocation.Transport(const Target: IBinaryTransport)
   ///  [line: 199, column: 23, file: System.Memory.Allocation]
   ,Transport:function(Self, Target$2) {
      var Data$13 = [];
      if (Target$2===null) {
         throw Exception.Create($New(EAllocation),"Invalid transport interface, reference was NIL error");
      } else {
         if (!TAllocation.a$28(Self)) {
            try {
               Data$13 = TDatatype.TypedArrayToBytes(TDatatype,TAllocation.GetHandle(Self));
               Target$2[3](Target$2[0](),Data$13);
            } catch ($e) {
               var e$4 = $W($e);
               throw EW3Exception.CreateFmt($New(EAllocation),"Data transport failed, mechanism threw exception %s with error [%s]",[TObject.ClassName(e$4.ClassType), e$4.FMessage]);
            }
         }
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,HandleAllocated$:function($){return $.ClassType.HandleAllocated($)}
   ,HandleReleased$:function($){return $.ClassType.HandleReleased($)}
};
TAllocation.$Intf={
   IBinaryTransport:[TAllocation.DataOffset$1,TAllocation.DataGetSize$1,TAllocation.DataRead$1,TAllocation.DataWrite$1]
   ,IAllocation:[TAllocation.GetHandle,TAllocation.GetTotalSize$1,TAllocation.GetSize$3,TAllocation.GetTransport,TAllocation.Allocate$1,TAllocation.Grow,TAllocation.Shrink,TAllocation.ReAllocate,TAllocation.Transport,TAllocation.Release$2]
}
function a$203(Self) {
   return ((!Self[0]())?true:false);
}/// EAllocation = class (EW3Exception)
///  [line: 22, column: 3, file: System.Memory.Allocation]
var EAllocation = {
   $ClassName:"EAllocation",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3CustomReader = class (TObject)
///  [line: 38, column: 3, file: System.Reader]
var TW3CustomReader = {
   $ClassName:"TW3CustomReader",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FAccess$2 = null;
      $.FOffset$2 = $.FTotalSize$1 = 0;
      $.FOptions$2 = [0];
   }
   /// constructor TW3CustomReader.Create(const Access: IBinaryTransport)
   ///  [line: 104, column: 29, file: System.Reader]
   ,Create$29:function(Self, Access) {
      TObject.Create(Self);
      Self.FAccess$2 = Access;
      Self.FOffset$2 = Self.FAccess$2[0]();
      Self.FTotalSize$1 = Self.FAccess$2[1]();
      Self.FOptions$2 = [1];
      return Self
   }
   /// function TW3CustomReader.GetReadOffset() : Integer
   ///  [line: 125, column: 26, file: System.Reader]
   ,GetReadOffset:function(Self) {
      var Result = 0;
      if ($SetIn(Self.FOptions$2,0,0,1)) {
         Result = Self.FOffset$2;
      } else {
         Result = Self.FAccess$2[0]();
      }
      return Result
   }
   /// function TW3CustomReader.GetTotalSize() : Integer
   ///  [line: 118, column: 26, file: System.Reader]
   ,GetTotalSize$2:function(Self) {
      var Result = 0;
      if ($SetIn(Self.FOptions$2,0,0,1)) {
         Result = Self.FTotalSize$1;
      } else {
         Result = Self.FAccess$2[1]();
      }
      return Result
   }
   /// function TW3CustomReader.QueryBreachOfBoundary(const NumberOfBytes: Integer) : Boolean
   ///  [line: 132, column: 26, file: System.Reader]
   ,QueryBreachOfBoundary$1:function(Self, NumberOfBytes$3) {
      return TW3CustomReader.GetTotalSize$2(Self)-TW3CustomReader.GetReadOffset(Self)<NumberOfBytes$3;
   }
   /// function TW3CustomReader.Read(const BytesToRead: Integer) : TByteArray
   ///  [line: 137, column: 26, file: System.Reader]
   ,Read$1:function(Self, BytesToRead) {
      var Result = [];
      if (BytesToRead>0) {
         Result = Self.FAccess$2[2](TW3CustomReader.GetReadOffset(Self),BytesToRead);
         if ($SetIn(Self.FOptions$2,0,0,1)) {
            (Self.FOffset$2+= Result.length);
         }
      } else {
         throw EW3Exception.Create$20($New(EW3ReadError),"TW3CustomReader.Read",Self,("Invalid read length ("+BytesToRead.toString()+")"));
      }
      return Result
   }
   /// function TW3CustomReader.ReadInteger() : Integer
   ///  [line: 267, column: 26, file: System.Reader]
   ,ReadInteger:function(Self) {
      var Result = 0;
      var LBytesToRead = 0,
         Data$14 = [];
      LBytesToRead = TDatatype.SizeOfType(TDatatype,7);
      if (TW3CustomReader.QueryBreachOfBoundary$1(Self,LBytesToRead)) {
         throw EW3Exception.Create$20($New(EW3ReadError),"TW3CustomReader.ReadInteger",Self,Format($R[10],[LBytesToRead]));
      } else {
         Data$14 = TW3CustomReader.Read$1(Self,LBytesToRead);
         Result = TDatatype.BytesToInt32(TDatatype,Data$14);
      }
      return Result
   }
   /// function TW3CustomReader.ReadStr(const BytesToRead: Integer) : String
   ///  [line: 279, column: 26, file: System.Reader]
   ,ReadStr:function(Self, BytesToRead$1) {
      var Result = "";
      var LData$1 = [];
      if (TW3CustomReader.QueryBreachOfBoundary$1(Self,BytesToRead$1)) {
         throw EW3Exception.Create$20($New(EW3ReadError),"TW3CustomReader.ReadStr",Self,Format($R[10],[BytesToRead$1]));
      } else {
         if (BytesToRead$1>0) {
            LData$1 = TW3CustomReader.Read$1(Self,BytesToRead$1);
            Result = TDatatype.BytesToString(TDatatype,LData$1);
         }
      }
      return Result
   }
   /// function TW3CustomReader.ReadString() : String
   ///  [line: 297, column: 26, file: System.Reader]
   ,ReadString$1:function(Self) {
      var Result = "";
      var LSignature = 0;
      var LLength = 0;
      LSignature = TW3CustomReader.ReadInteger(Self);
      if (LSignature==3131756270) {
         LLength = TW3CustomReader.ReadInteger(Self);
         if (LLength>0) {
            Result = TW3CustomReader.ReadStr(Self,LLength);
         }
      } else {
         throw EW3Exception.Create$20($New(EW3ReadError),"TW3CustomReader.ReadString",Self,Format($R[11],["string"]));
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TReader = class (TW3CustomReader)
///  [line: 74, column: 3, file: System.Reader]
var TReader = {
   $ClassName:"TReader",$Parent:TW3CustomReader
   ,$Init:function ($) {
      TW3CustomReader.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// EW3ReadError = class (EW3Exception)
///  [line: 34, column: 3, file: System.Reader]
var EW3ReadError = {
   $ClassName:"EW3ReadError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3CustomWriter = class (TObject)
///  [line: 39, column: 3, file: System.Writer]
var TW3CustomWriter = {
   $ClassName:"TW3CustomWriter",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FAccess = null;
      $.FOffset = $.FTotalSize = 0;
      $.FOptions = [0];
   }
   /// constructor TW3CustomWriter.Create(const Access: IBinaryTransport)
   ///  [line: 103, column: 29, file: System.Writer]
   ,Create$4:function(Self, Access$1) {
      TObject.Create(Self);
      Self.FAccess = Access$1;
      Self.FOffset = Self.FAccess[0]();
      Self.FTotalSize = Self.FAccess[1]();
      Self.FOptions = [3];
      return Self
   }
   /// function TW3CustomWriter.GetOffset() : Integer
   ///  [line: 126, column: 26, file: System.Writer]
   ,GetOffset:function(Self) {
      var Result = 0;
      if ($SetIn(Self.FOptions,0,0,2)) {
         Result = Self.FOffset;
      } else {
         Result = Self.FAccess[0]();
      }
      return Result
   }
   /// function TW3CustomWriter.GetTotalFree() : Integer
   ///  [line: 154, column: 26, file: System.Writer]
   ,GetTotalFree:function(Self) {
      return Self.FAccess[1]()-TW3CustomWriter.GetOffset(Self);
   }
   /// function TW3CustomWriter.GetTotalSize() : Integer
   ///  [line: 117, column: 26, file: System.Writer]
   ,GetTotalSize:function(Self) {
      var Result = 0;
      if ($SetIn(Self.FOptions,0,0,2)) {
         Result = 2147483647;
      } else {
         Result = Self.FAccess[1]();
      }
      return Result
   }
   /// function TW3CustomWriter.QueryBreachOfBoundary(const BytesToFit: Integer) : Boolean
   ///  [line: 134, column: 26, file: System.Writer]
   ,QueryBreachOfBoundary:function(Self, BytesToFit) {
      var Result = false;
      if (BytesToFit>=1) {
         if ($SetIn(Self.FOptions,1,0,2)) {
            Result = false;
         } else {
            Result = TW3CustomWriter.GetTotalFree(Self)<BytesToFit;
         }
      }
      return Result
   }
   /// function TW3CustomWriter.Write(Data: TByteArray) : Integer
   ///  [line: 159, column: 26, file: System.Writer]
   ,Write:function(Self, Data$15) {
      var Result = 0;
      var LBytesToWrite = 0;
      var LBytesLeft = 0,
         LBytesMissing = 0;
      LBytesToWrite = Data$15.length;
      if (LBytesToWrite>0) {
         if ($SetIn(Self.FOptions,1,0,2)) {
            Self.FAccess[3](TW3CustomWriter.GetOffset(Self),Data$15);
            if ($SetIn(Self.FOptions,0,0,2)) {
               (Self.FOffset+= Data$15.length);
            }
         } else {
            if (TW3CustomWriter.QueryBreachOfBoundary(Self,LBytesToWrite)) {
               LBytesLeft = TW3CustomWriter.GetTotalSize(Self)-TW3CustomWriter.GetOffset(Self);
               LBytesMissing = Math.abs(LBytesLeft-LBytesToWrite);
               (LBytesToWrite-= LBytesMissing);
               $ArraySetLenC(Data$15,LBytesToWrite,function (){return 0});
            }
            if (LBytesToWrite>1) {
               Self.FAccess[3](TW3CustomWriter.GetOffset(Self),Data$15);
               if ($SetIn(Self.FOptions,0,0,2)) {
                  (Self.FOffset+= Data$15.length);
               }
            } else {
               throw EW3Exception.Create$20($New(EW3WriteError),"TW3CustomWriter.Write",Self,Format($R[12],[Data$15.length]));
            }
         }
         Result = Data$15.length;
      } else {
         throw EW3Exception.Create$20($New(EW3WriteError),"TW3CustomWriter.Write",Self,Format($R[14],[LBytesToWrite]));
      }
      return Result
   }
   /// procedure TW3CustomWriter.WriteInteger(const Value: Integer)
   ///  [line: 314, column: 27, file: System.Writer]
   ,WriteInteger:function(Self, Value$15) {
      var LBytesToWrite$1 = 0;
      LBytesToWrite$1 = TDatatype.SizeOfType(TDatatype,7);
      if (TW3CustomWriter.QueryBreachOfBoundary(Self,LBytesToWrite$1)) {
         throw EW3Exception.Create$20($New(EW3WriteError),"TW3CustomWriter.WriteInteger",Self,Format($R[12],[LBytesToWrite$1]));
      } else {
         TW3CustomWriter.Write(Self,TDatatype.Int32ToBytes(TDatatype,Value$15));
      }
   }
   /// procedure TW3CustomWriter.WriteString(const Value: String)
   ///  [line: 346, column: 27, file: System.Writer]
   ,WriteString:function(Self, Value$16) {
      var LBytes = [],
         LTotal = 0;
      (LTotal+= TDatatype.SizeOfType(TDatatype,7));
      (LTotal+= TDatatype.SizeOfType(TDatatype,7));
      LBytes = TDatatype.StringToBytes(TDatatype,Value$16);
      (LTotal+= LBytes.length);
      if (TW3CustomWriter.QueryBreachOfBoundary(Self,LTotal)) {
         throw EW3Exception.Create$20($New(EW3WriteError),"TW3CustomWriter.WriteString",Self,Format($R[12],[LTotal]));
      } else {
         try {
            TW3CustomWriter.WriteInteger(Self,3131756270);
            TW3CustomWriter.WriteInteger(Self,LBytes.length);
            if (LBytes.length>0) {
               TW3CustomWriter.Write(Self,LBytes);
            }
         } catch ($e) {
            var e$5 = $W($e);
            throw EW3Exception.Create$20($New(EW3WriteError),"TW3CustomWriter.WriteString",Self,e$5.FMessage);
         }
      }
   }
   ,Destroy:TObject.Destroy
};
/// TWriter = class (TW3CustomWriter)
///  [line: 77, column: 3, file: System.Writer]
var TWriter = {
   $ClassName:"TWriter",$Parent:TW3CustomWriter
   ,$Init:function ($) {
      TW3CustomWriter.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// EW3WriteError = class (EW3Exception)
///  [line: 31, column: 3, file: System.Writer]
var EW3WriteError = {
   $ClassName:"EW3WriteError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function WriteLnF(Text$2, Data$16) {
   util().log(Format(String(Text$2),Data$16.slice(0)));
};
/// TW3ErrorObject = class (TObject)
///  [line: 56, column: 3, file: System.Objects]
var TW3ErrorObject = {
   $ClassName:"TW3ErrorObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FLastError = "";
      $.FOptions$3 = null;
   }
   /// procedure TW3ErrorObject.ClearLastError()
   ///  [line: 351, column: 26, file: System.Objects]
   ,ClearLastError:function(Self) {
      Self.FLastError = "";
   }
   /// constructor TW3ErrorObject.Create()
   ///  [line: 288, column: 28, file: System.Objects]
   ,Create$31:function(Self) {
      TObject.Create(Self);
      Self.FOptions$3 = TW3ErrorObjectOptions.Create$37($New(TW3ErrorObjectOptions));
      return Self
   }
   /// destructor TW3ErrorObject.Destroy()
   ///  [line: 294, column: 27, file: System.Objects]
   ,Destroy:function(Self) {
      TObject.Free(Self.FOptions$3);
      TObject.Destroy(Self);
   }
   /// function TW3ErrorObject.GetExceptionClass() : TW3ExceptionClass
   ///  [line: 356, column: 25, file: System.Objects]
   ,GetExceptionClass:function(Self) {
      return EW3ErrorObject;
   }
   /// function TW3ErrorObject.GetFailed() : Boolean
   ///  [line: 305, column: 25, file: System.Objects]
   ,GetFailed:function(Self) {
      return Self.FLastError.length>0;
   }
   /// function TW3ErrorObject.GetLastError() : String
   ///  [line: 300, column: 25, file: System.Objects]
   ,GetLastError:function(Self) {
      return Self.FLastError;
   }
   /// procedure TW3ErrorObject.SetLastError(const ErrorText: String)
   ///  [line: 310, column: 26, file: System.Objects]
   ,SetLastError:function(Self, ErrorText$1) {
      var ErrClass = null;
      Self.FLastError = Trim$_String_(ErrorText$1);
      if (Self.FLastError.length>0) {
         if (Self.FOptions$3.AutoWriteToConsole) {
            if (console) {
          console.log( (Self.FLastError) );
       }
         }
         if (Self.FOptions$3.ThrowExceptions) {
            ErrClass = TW3ErrorObject.GetExceptionClass(Self);
            if (!ErrClass) {
               ErrClass = EW3ErrorObject;
            }
            throw Exception.Create($NewDyn(ErrClass,""),Self.FLastError);
         }
      }
   }
   /// procedure TW3ErrorObject.SetLastErrorF(const ErrorText: String; const Values: array of const)
   ///  [line: 345, column: 26, file: System.Objects]
   ,SetLastErrorF:function(Self, ErrorText$2, Values$2) {
      TW3ErrorObject.SetLastError(Self,Format(ErrorText$2,Values$2.slice(0)));
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
TW3ErrorObject.$Intf={
   IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TW3DirectoryParser = class (TW3ErrorObject)
///  [line: 49, column: 3, file: System.IOUtils]
var TW3DirectoryParser = {
   $ClassName:"TW3DirectoryParser",$Parent:TW3ErrorObject
   ,$Init:function ($) {
      TW3ErrorObject.$Init($);
   }
   /// function TW3DirectoryParser.GetErrorObject() : IW3ErrorAccess
   ///  [line: 176, column: 29, file: System.IOUtils]
   ,GetErrorObject:function(Self) {
      return $AsIntf(Self,"IW3ErrorAccess");
   }
   /// function TW3DirectoryParser.IsPathRooted(FilePath: String) : Boolean
   ///  [line: 181, column: 29, file: System.IOUtils]
   ,IsPathRooted:function(Self, FilePath) {
      var Result = false;
      var LMoniker = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      FilePath = (Trim$_String_(FilePath)).toLocaleLowerCase();
      if (FilePath.length>0) {
         LMoniker = TW3DirectoryParser.GetRootMoniker$(Self);
         Result = StrBeginsWith(FilePath,LMoniker);
      }
      return Result
   }
   /// function TW3DirectoryParser.IsRelativePath(FilePath: String) : Boolean
   ///  [line: 194, column: 29, file: System.IOUtils]
   ,IsRelativePath:function(Self, FilePath$1) {
      var Result = false;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (TW3DirectoryParser.IsValidPath$(Self,FilePath$1)) {
         Result = !StrBeginsWith(FilePath$1,TW3DirectoryParser.GetRootMoniker$(Self));
      }
      return Result
   }
   ,Destroy:TW3ErrorObject.Destroy
   ,ChangeFileExt$:function($){return $.ClassType.ChangeFileExt.apply($.ClassType, arguments)}
   ,ExcludeLeadingPathDelimiter$:function($){return $.ClassType.ExcludeLeadingPathDelimiter.apply($.ClassType, arguments)}
   ,ExcludeTrailingPathDelimiter$:function($){return $.ClassType.ExcludeTrailingPathDelimiter.apply($.ClassType, arguments)}
   ,GetDevice$:function($){return $.ClassType.GetDevice.apply($.ClassType, arguments)}
   ,GetDirectoryName$:function($){return $.ClassType.GetDirectoryName.apply($.ClassType, arguments)}
   ,GetExtension$:function($){return $.ClassType.GetExtension.apply($.ClassType, arguments)}
   ,GetFileName$:function($){return $.ClassType.GetFileName.apply($.ClassType, arguments)}
   ,GetFileNameWithoutExtension$:function($){return $.ClassType.GetFileNameWithoutExtension.apply($.ClassType, arguments)}
   ,GetPathName$:function($){return $.ClassType.GetPathName.apply($.ClassType, arguments)}
   ,GetPathSeparator$:function($){return $.ClassType.GetPathSeparator($)}
   ,GetRootMoniker$:function($){return $.ClassType.GetRootMoniker($)}
   ,HasValidFileNameChars$:function($){return $.ClassType.HasValidFileNameChars.apply($.ClassType, arguments)}
   ,HasValidPathChars$:function($){return $.ClassType.HasValidPathChars.apply($.ClassType, arguments)}
   ,IncludeLeadingPathDelimiter$:function($){return $.ClassType.IncludeLeadingPathDelimiter.apply($.ClassType, arguments)}
   ,IncludeTrailingPathDelimiter$:function($){return $.ClassType.IncludeTrailingPathDelimiter.apply($.ClassType, arguments)}
   ,IsValidPath$:function($){return $.ClassType.IsValidPath.apply($.ClassType, arguments)}
};
TW3DirectoryParser.$Intf={
   IW3DirectoryParser:[TW3DirectoryParser.GetPathSeparator,TW3DirectoryParser.GetRootMoniker,TW3DirectoryParser.GetErrorObject,TW3DirectoryParser.IsValidPath,TW3DirectoryParser.HasValidPathChars,TW3DirectoryParser.HasValidFileNameChars,TW3DirectoryParser.IsRelativePath,TW3DirectoryParser.IsPathRooted,TW3DirectoryParser.GetFileNameWithoutExtension,TW3DirectoryParser.GetPathName,TW3DirectoryParser.GetDevice,TW3DirectoryParser.GetFileName,TW3DirectoryParser.GetExtension,TW3DirectoryParser.GetDirectoryName,TW3DirectoryParser.IncludeTrailingPathDelimiter,TW3DirectoryParser.IncludeLeadingPathDelimiter,TW3DirectoryParser.ExcludeLeadingPathDelimiter,TW3DirectoryParser.ExcludeTrailingPathDelimiter,TW3DirectoryParser.ChangeFileExt]
   ,IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TW3UnixDirectoryParser = class (TW3DirectoryParser)
///  [line: 81, column: 3, file: System.IOUtils]
var TW3UnixDirectoryParser = {
   $ClassName:"TW3UnixDirectoryParser",$Parent:TW3DirectoryParser
   ,$Init:function ($) {
      TW3DirectoryParser.$Init($);
   }
   /// function TW3UnixDirectoryParser.ChangeFileExt(const FilePath: String; NewExt: String) : String
   ///  [line: 670, column: 33, file: System.IOUtils]
   ,ChangeFileExt:function(Self, FilePath$2, NewExt) {
      NewExt={v:NewExt};
      var Result = "";
      var Separator = "",
         x$8 = 0;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      Separator = TW3DirectoryParser.GetPathSeparator$(Self);
      if (StrEndsWith(FilePath$2,Separator)) {
         TW3ErrorObject.SetLastError(Self,"Failed to change extension, path has no filename error");
         Result = FilePath$2;
         return Result;
      }
      NewExt.v = Trim$_String_(NewExt.v);
      while ((NewExt.v.charAt(0)==".")) {
         Delete(NewExt,1,1);
         if (NewExt.v.length<1) {
            break;
         }
      }
      if (NewExt.v.length>0) {
         NewExt.v = "."+NewExt.v;
      }
      for(x$8=FilePath$2.length;x$8>=1;x$8--) {
         {var $temp11 = FilePath$2.charAt(x$8-1);
            if ($temp11==".") {
               Result = FilePath$2.substr(0,(x$8-1))+NewExt.v;
               break;
            }
             else if ($temp11==Separator) {
               Result = FilePath$2+NewExt.v;
               break;
            }
         }
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.ExcludeLeadingPathDelimiter(const FilePath: String) : String
   ///  [line: 723, column: 33, file: System.IOUtils]
   ,ExcludeLeadingPathDelimiter:function(Self, FilePath$3) {
      var Result = "";
      if (StrBeginsWith(FilePath$3,TW3DirectoryParser.GetPathSeparator$(Self))) {
         Result = FilePath$3.substr(1);
      } else {
         Result = FilePath$3;
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.ExcludeTrailingPathDelimiter(const FilePath: String) : String
   ///  [line: 739, column: 33, file: System.IOUtils]
   ,ExcludeTrailingPathDelimiter:function(Self, FilePath$4) {
      var Result = "";
      if (StrEndsWith(FilePath$4,TW3DirectoryParser.GetPathSeparator$(Self))) {
         Result = (FilePath$4).substr(0,(FilePath$4.length-1));
      } else {
         Result = FilePath$4;
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetDevice(const FilePath: String) : String
   ///  [line: 517, column: 33, file: System.IOUtils]
   ,GetDevice:function(Self, FilePath$5) {
      var Result = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$5.length>0) {
         if (StrBeginsWith(FilePath$5,TW3DirectoryParser.GetRootMoniker$(Self))) {
            Result = TW3DirectoryParser.GetRootMoniker$(Self);
         } else {
            Result = "";
         }
      } else {
         TW3ErrorObject.SetLastError(Self,"Failed to extract device, path was empty error");
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetDirectoryName(const FilePath: String) : String
   ///  [line: 604, column: 33, file: System.IOUtils]
   ,GetDirectoryName:function(Self, FilePath$6) {
      var Result = "";
      var Separator$1 = "",
         NameParts = [];
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$6.length>0) {
         Separator$1 = TW3DirectoryParser.GetPathSeparator$(Self);
         if (StrEndsWith(FilePath$6,Separator$1)) {
            Result = FilePath$6;
            return Result;
         }
         NameParts = (FilePath$6).split(Separator$1);
         NameParts.splice((NameParts.length-1),1)
         ;
         Result = (NameParts).join(Separator$1)+Separator$1;
      } else {
         TW3ErrorObject.SetLastError(Self,"Failed to extract directory, path was empty error");
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetExtension(const Filename: String) : String
   ///  [line: 627, column: 33, file: System.IOUtils]
   ,GetExtension:function(Self, Filename$1) {
      var Result = "";
      var Separator$2 = "",
         x$9 = 0;
      var dx = 0;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (Filename$1.length>0) {
         Separator$2 = TW3DirectoryParser.GetPathSeparator$(Self);
         if (StrEndsWith(Filename$1,Separator$2)) {
            TW3ErrorObject.SetLastError(Self,"Failed to extract extension, path contains no filename error");
         } else {
            for(x$9=Filename$1.length;x$9>=1;x$9--) {
               {var $temp12 = Filename$1.charAt(x$9-1);
                  if ($temp12==".") {
                     dx = Filename$1.length;
                     (dx-= x$9);
                     ++dx;
                     Result = RightStr(Filename$1,dx);
                     break;
                  }
                   else if ($temp12==Separator$2) {
                     break;
                  }
               }
            }
         }
      } else {
         TW3ErrorObject.SetLastError(Self,"Failed to extract extension, filename was empty error");
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetFileName(const FilePath: String) : String
   ///  [line: 585, column: 33, file: System.IOUtils]
   ,GetFileName:function(Self, FilePath$7) {
      var Result = "";
      var Temp$1 = "",
         Separator$3 = "",
         Parts = [];
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      Temp$1 = Trim$_String_(FilePath$7);
      if (Temp$1.length>0) {
         Separator$3 = TW3DirectoryParser.GetPathSeparator$(Self);
         if (StrEndsWith(Temp$1,Separator$3)) {
            TW3ErrorObject.SetLastError(Self,"No filename part in path error");
         } else {
            Parts = (Temp$1).split(Separator$3);
            Result = Parts[(Parts.length-1)];
         }
      } else {
         TW3ErrorObject.SetLastError(Self,"Failed to extract filename, path was empty error");
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetFileNameWithoutExtension(const Filename: String) : String
   ///  [line: 575, column: 33, file: System.IOUtils]
   ,GetFileNameWithoutExtension:function(Self, Filename$2) {
      var Result = "";
      var temp$1 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      temp$1 = TW3DirectoryParser.GetFileName$(Self,Filename$2);
      if (!TW3ErrorObject.GetFailed(Self)) {
         Result = TW3DirectoryParser.ChangeFileExt$(Self,temp$1,"");
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetPathName(const FilePath: String) : String
   ///  [line: 532, column: 33, file: System.IOUtils]
   ,GetPathName:function(Self, FilePath$8) {
      var Result = "";
      var Temp$2 = "",
         Parts$1 = [],
         Separator$4 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      Temp$2 = Trim$_String_(FilePath$8);
      if (Temp$2.length>0) {
         Separator$4 = TW3DirectoryParser.GetPathSeparator$(Self);
         if (StrEndsWith(Temp$2,Separator$4)) {
            if (Temp$2==TW3DirectoryParser.GetRootMoniker$(Self)) {
               TW3ErrorObject.SetLastError(Self,"Failed to get directory name, path is root");
               return "";
            }
            Temp$2 = (Temp$2).substr(0,(Temp$2.length-1));
            Parts$1 = (Temp$2).split(Separator$4);
            Result = Parts$1[(Parts$1.length-1)];
            return Result;
         }
         Parts$1 = (Temp$2).split(Separator$4);
         if (Parts$1.length>1) {
            Result = Parts$1[(Parts$1.length-1)-1];
         } else {
            Result = Parts$1[(Parts$1.length-1)];
         }
      } else {
         TW3ErrorObject.SetLastError(Self,"Failed to extract directory name, path was empty error");
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.GetPathSeparator() : Char
   ///  [line: 398, column: 33, file: System.IOUtils]
   ,GetPathSeparator:function(Self) {
      return "\/";
   }
   /// function TW3UnixDirectoryParser.GetRootMoniker() : String
   ///  [line: 403, column: 33, file: System.IOUtils]
   ,GetRootMoniker:function(Self) {
      return "~\/";
   }
   /// function TW3UnixDirectoryParser.HasValidFileNameChars(FileName: String) : Boolean
   ///  [line: 408, column: 33, file: System.IOUtils]
   ,HasValidFileNameChars:function(Self, FileName) {
      var Result = false;
      var el = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FileName.length>0) {
         if ((FileName.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \" \" in filename \"%s\" error",[FileName]);
         } else {
            for (var $temp13=0;$temp13<FileName.length;$temp13++) {
               el=$uniCharAt(FileName,$temp13);
               if (!el) continue;
               Result = (((el>="A")&&(el<="Z"))||((el>="a")&&(el<="z"))||((el>="0")&&(el<="9"))||(el=="-")||(el=="_")||(el==".")||(el==" "));
               if (!Result) {
                  TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \"%s\" in filename \"%s\" error",[el, FileName]);
                  break;
               }
            }
         }
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.HasValidPathChars(FolderName: String) : Boolean
   ///  [line: 437, column: 33, file: System.IOUtils]
   ,HasValidPathChars:function(Self, FolderName) {
      var Result = false;
      var el$1 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if ((FolderName.charAt(0)==" ")) {
         TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \" \" in foldername \"%s\" error",[FolderName]);
      } else {
         if (FolderName.length>0) {
            for (var $temp14=0;$temp14<FolderName.length;$temp14++) {
               el$1=$uniCharAt(FolderName,$temp14);
               if (!el$1) continue;
               Result = (((el$1>="A")&&(el$1<="Z"))||((el$1>="a")&&(el$1<="z"))||((el$1>="0")&&(el$1<="9"))||(el$1=="-")||(el$1=="_")||(el$1==".")||(el$1==" "));
               if (!Result) {
                  TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \"%s\" in foldername \"%s\" error",[el$1, FolderName]);
                  break;
               }
            }
         }
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.IncludeLeadingPathDelimiter(const FilePath: String) : String
   ///  [line: 714, column: 33, file: System.IOUtils]
   ,IncludeLeadingPathDelimiter:function(Self, FilePath$9) {
      var Result = "";
      var Separator$5 = "";
      Separator$5 = TW3DirectoryParser.GetPathSeparator$(Self);
      if (StrBeginsWith(FilePath$9,Separator$5)) {
         Result = FilePath$9;
      } else {
         Result = Separator$5+FilePath$9;
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.IncludeTrailingPathDelimiter(const FilePath: String) : String
   ///  [line: 731, column: 33, file: System.IOUtils]
   ,IncludeTrailingPathDelimiter:function(Self, FilePath$10) {
      var Result = "";
      var LSeparator = "";
      LSeparator = TW3DirectoryParser.GetPathSeparator$(Self);
      Result = FilePath$10;
      if (!StrEndsWith(Result,LSeparator)) {
         Result+=LSeparator;
      }
      return Result
   }
   /// function TW3UnixDirectoryParser.IsValidPath(FilePath: String) : Boolean
   ///  [line: 466, column: 33, file: System.IOUtils]
   ,IsValidPath:function(Self, FilePath$11) {
      var Result = false;
      var Separator$6 = "",
         PathParts = [],
         Index = 0,
         a$204 = 0;
      var part = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if ((FilePath$11.charAt(0)==" ")) {
         TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \" \" in path \"%s\" error",[FilePath$11]);
      } else {
         if (FilePath$11.length>0) {
            Separator$6 = TW3DirectoryParser.GetPathSeparator$(Self);
            PathParts = (FilePath$11).split(Separator$6);
            Index = 0;
            var $temp15;
            for(a$204=0,$temp15=PathParts.length;a$204<$temp15;a$204++) {
               part = PathParts[a$204];
               {var $temp16 = part;
                  if ($temp16=="") {
                     TW3ErrorObject.SetLastErrorF(Self,"Path has multiple separators (%s) error",[FilePath$11]);
                     return false;
                  }
                   else if ($temp16=="~") {
                     if (Index>0) {
                        TW3ErrorObject.SetLastErrorF(Self,"Path has misplaced root moniker (%s) error",[FilePath$11]);
                        return false;
                     }
                  }
                   else {
                     if (Index==(PathParts.length-1)) {
                        if (!TW3DirectoryParser.HasValidFileNameChars$(Self,part)) {
                           return false;
                        }
                     } else if (!TW3DirectoryParser.HasValidPathChars$(Self,part)) {
                        return false;
                     }
                  }
               }
               Index+=1;
            }
            Result = true;
         }
      }
      return Result
   }
   ,Destroy:TW3ErrorObject.Destroy
   ,ChangeFileExt$:function($){return $.ClassType.ChangeFileExt.apply($.ClassType, arguments)}
   ,ExcludeLeadingPathDelimiter$:function($){return $.ClassType.ExcludeLeadingPathDelimiter.apply($.ClassType, arguments)}
   ,ExcludeTrailingPathDelimiter$:function($){return $.ClassType.ExcludeTrailingPathDelimiter.apply($.ClassType, arguments)}
   ,GetDevice$:function($){return $.ClassType.GetDevice.apply($.ClassType, arguments)}
   ,GetDirectoryName$:function($){return $.ClassType.GetDirectoryName.apply($.ClassType, arguments)}
   ,GetExtension$:function($){return $.ClassType.GetExtension.apply($.ClassType, arguments)}
   ,GetFileName$:function($){return $.ClassType.GetFileName.apply($.ClassType, arguments)}
   ,GetFileNameWithoutExtension$:function($){return $.ClassType.GetFileNameWithoutExtension.apply($.ClassType, arguments)}
   ,GetPathName$:function($){return $.ClassType.GetPathName.apply($.ClassType, arguments)}
   ,GetPathSeparator$:function($){return $.ClassType.GetPathSeparator($)}
   ,GetRootMoniker$:function($){return $.ClassType.GetRootMoniker($)}
   ,HasValidFileNameChars$:function($){return $.ClassType.HasValidFileNameChars.apply($.ClassType, arguments)}
   ,HasValidPathChars$:function($){return $.ClassType.HasValidPathChars.apply($.ClassType, arguments)}
   ,IncludeLeadingPathDelimiter$:function($){return $.ClassType.IncludeLeadingPathDelimiter.apply($.ClassType, arguments)}
   ,IncludeTrailingPathDelimiter$:function($){return $.ClassType.IncludeTrailingPathDelimiter.apply($.ClassType, arguments)}
   ,IsValidPath$:function($){return $.ClassType.IsValidPath.apply($.ClassType, arguments)}
};
TW3UnixDirectoryParser.$Intf={
   IW3DirectoryParser:[TW3UnixDirectoryParser.GetPathSeparator,TW3UnixDirectoryParser.GetRootMoniker,TW3DirectoryParser.GetErrorObject,TW3UnixDirectoryParser.IsValidPath,TW3UnixDirectoryParser.HasValidPathChars,TW3UnixDirectoryParser.HasValidFileNameChars,TW3DirectoryParser.IsRelativePath,TW3DirectoryParser.IsPathRooted,TW3UnixDirectoryParser.GetFileNameWithoutExtension,TW3UnixDirectoryParser.GetPathName,TW3UnixDirectoryParser.GetDevice,TW3UnixDirectoryParser.GetFileName,TW3UnixDirectoryParser.GetExtension,TW3UnixDirectoryParser.GetDirectoryName,TW3UnixDirectoryParser.IncludeTrailingPathDelimiter,TW3UnixDirectoryParser.IncludeLeadingPathDelimiter,TW3UnixDirectoryParser.ExcludeLeadingPathDelimiter,TW3UnixDirectoryParser.ExcludeTrailingPathDelimiter,TW3UnixDirectoryParser.ChangeFileExt]
   ,IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TW3Win32DirectoryParser = class (TW3UnixDirectoryParser)
///  [line: 62, column: 3, file: SmartNJ.System]
var TW3Win32DirectoryParser = {
   $ClassName:"TW3Win32DirectoryParser",$Parent:TW3UnixDirectoryParser
   ,$Init:function ($) {
      TW3UnixDirectoryParser.$Init($);
   }
   /// function TW3Win32DirectoryParser.GetPathSeparator() : Char
   ///  [line: 609, column: 34, file: SmartNJ.System]
   ,GetPathSeparator:function(Self) {
      return "\\";
   }
   /// function TW3Win32DirectoryParser.GetRootMoniker() : String
   ///  [line: 614, column: 34, file: SmartNJ.System]
   ,GetRootMoniker:function(Self) {
      var Result = "";
      function GetDriveFrom(ThisPath) {
         var Result = "";
         var xpos = 0;
         xpos = (ThisPath.indexOf(":\\")+1);
         if (xpos>=2) {
            ++xpos;
            Result = ThisPath.substr(0,xpos);
         }
         return Result
      };
      Result = (GetDriveFrom(ParamStr$1(1))).toLocaleLowerCase();
      if (Result.length<2) {
         Result = GetDriveFrom(ParamStr$1(0));
         if (Result.length<2) {
            throw Exception.Create($New(Exception),"Failed to extract root moniker from script path error");
         }
      }
      return Result
   }
   ,Destroy:TW3ErrorObject.Destroy
   ,ChangeFileExt:TW3UnixDirectoryParser.ChangeFileExt
   ,ExcludeLeadingPathDelimiter:TW3UnixDirectoryParser.ExcludeLeadingPathDelimiter
   ,ExcludeTrailingPathDelimiter:TW3UnixDirectoryParser.ExcludeTrailingPathDelimiter
   ,GetDevice:TW3UnixDirectoryParser.GetDevice
   ,GetDirectoryName:TW3UnixDirectoryParser.GetDirectoryName
   ,GetExtension:TW3UnixDirectoryParser.GetExtension
   ,GetFileName:TW3UnixDirectoryParser.GetFileName
   ,GetFileNameWithoutExtension:TW3UnixDirectoryParser.GetFileNameWithoutExtension
   ,GetPathName:TW3UnixDirectoryParser.GetPathName
   ,GetPathSeparator$:function($){return $.ClassType.GetPathSeparator($)}
   ,GetRootMoniker$:function($){return $.ClassType.GetRootMoniker($)}
   ,HasValidFileNameChars:TW3UnixDirectoryParser.HasValidFileNameChars
   ,HasValidPathChars:TW3UnixDirectoryParser.HasValidPathChars
   ,IncludeLeadingPathDelimiter:TW3UnixDirectoryParser.IncludeLeadingPathDelimiter
   ,IncludeTrailingPathDelimiter:TW3UnixDirectoryParser.IncludeTrailingPathDelimiter
   ,IsValidPath:TW3UnixDirectoryParser.IsValidPath
};
TW3Win32DirectoryParser.$Intf={
   IW3DirectoryParser:[TW3Win32DirectoryParser.GetPathSeparator,TW3Win32DirectoryParser.GetRootMoniker,TW3DirectoryParser.GetErrorObject,TW3UnixDirectoryParser.IsValidPath,TW3UnixDirectoryParser.HasValidPathChars,TW3UnixDirectoryParser.HasValidFileNameChars,TW3DirectoryParser.IsRelativePath,TW3DirectoryParser.IsPathRooted,TW3UnixDirectoryParser.GetFileNameWithoutExtension,TW3UnixDirectoryParser.GetPathName,TW3UnixDirectoryParser.GetDevice,TW3UnixDirectoryParser.GetFileName,TW3UnixDirectoryParser.GetExtension,TW3UnixDirectoryParser.GetDirectoryName,TW3UnixDirectoryParser.IncludeTrailingPathDelimiter,TW3UnixDirectoryParser.IncludeLeadingPathDelimiter,TW3UnixDirectoryParser.ExcludeLeadingPathDelimiter,TW3UnixDirectoryParser.ExcludeTrailingPathDelimiter,TW3UnixDirectoryParser.ChangeFileExt]
   ,IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TW3PosixDirectoryParser = class (TW3DirectoryParser)
///  [line: 68, column: 3, file: SmartNJ.System]
var TW3PosixDirectoryParser = {
   $ClassName:"TW3PosixDirectoryParser",$Parent:TW3DirectoryParser
   ,$Init:function ($) {
      TW3DirectoryParser.$Init($);
   }
   /// function TW3PosixDirectoryParser.ChangeFileExt(const FilePath: String; NewExt: String) : String
   ///  [line: 479, column: 34, file: SmartNJ.System]
   ,ChangeFileExt:function(Self, FilePath$12, NewExt$1) {
      var Result = "";
      var LName$1 = "";
      var Separator$7 = "",
         x$10 = 0;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$12.length>0) {
         if ((FilePath$12.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in filename (\"%s\") error",[FilePath$12]);
         } else {
            if (StrEndsWith(FilePath$12," ")) {
               TW3ErrorObject.SetLastErrorF(Self,"Invalid trailing character (\" \") in filename (\"%s\") error",[FilePath$12]);
            } else {
               Separator$7 = TW3DirectoryParser.GetPathSeparator$(Self);
               if (StrEndsWith(LName$1,Separator$7)) {
                  TW3ErrorObject.SetLastErrorF(Self,"Path (%s) has no filename error",[FilePath$12]);
               } else {
                  if ((FilePath$12.indexOf(Separator$7)+1)>0) {
                     LName$1 = TW3DirectoryParser.GetFileName$(Self,FilePath$12);
                     if (TW3ErrorObject.GetFailed(Self)) {
                        return Result;
                     }
                  } else {
                     LName$1 = FilePath$12;
                  }
                  if (LName$1.length>0) {
                     if ((LName$1.indexOf(".")+1)>0) {
                        for(x$10=LName$1.length;x$10>=1;x$10--) {
                           if (LName$1.charAt(x$10-1)==".") {
                              Result = LName$1.substr(0,(x$10-1))+NewExt$1;
                              break;
                           }
                        }
                     } else {
                        Result = LName$1+NewExt$1;
                     }
                  }
               }
            }
         }
      } else {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid or empty filename (%s) error",[FilePath$12]);
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.ExcludeLeadingPathDelimiter(const FilePath: String) : String
   ///  [line: 596, column: 34, file: SmartNJ.System]
   ,ExcludeLeadingPathDelimiter:function(Self, FilePath$13) {
      var Result = "";
      var Separator$8 = "";
      Separator$8 = TW3DirectoryParser.GetPathSeparator$(Self);
      if (StrBeginsWith(FilePath$13,Separator$8)) {
         Result = FilePath$13.substr((1+Separator$8.length)-1);
      } else {
         Result = FilePath$13;
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.ExcludeTrailingPathDelimiter(const FilePath: String) : String
   ///  [line: 577, column: 34, file: SmartNJ.System]
   ,ExcludeTrailingPathDelimiter:function(Self, FilePath$14) {
      var Result = "";
      var Separator$9 = "";
      Separator$9 = TW3DirectoryParser.GetPathSeparator$(Self);
      if (StrEndsWith(FilePath$14,Separator$9)) {
         Result = FilePath$14.substr(0,(FilePath$14.length-Separator$9.length));
      } else {
         Result = FilePath$14;
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetDevice(const FilePath: String) : String
   ///  [line: 327, column: 34, file: SmartNJ.System]
   ,GetDevice:function(Self, FilePath$15) {
      var Result = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$15.length>0) {
         if (StrBeginsWith(FilePath$15,TW3DirectoryParser.GetRootMoniker$(Self))) {
            Result = TW3DirectoryParser.GetRootMoniker$(Self);
         } else {
            Result = "";
         }
      } else {
         TW3ErrorObject.SetLastError(Self,"Failed to extract device, path was empty error");
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetDirectoryName(const FilePath: String) : String
   ///  [line: 534, column: 34, file: SmartNJ.System]
   ,GetDirectoryName:function(Self, FilePath$16) {
      var Result = "";
      var Separator$10 = "",
         NameParts$1 = [];
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$16.length>0) {
         if ((FilePath$16.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in filename (\"%s\") error",[FilePath$16]);
         } else {
            if (StrEndsWith(FilePath$16," ")) {
               TW3ErrorObject.SetLastErrorF(Self,"Invalid trailing character (\" \") in filename (\"%s\") error",[FilePath$16]);
            } else {
               Separator$10 = TW3DirectoryParser.GetPathSeparator$(Self);
               if (StrEndsWith(FilePath$16,Separator$10)) {
                  Result = FilePath$16;
                  return Result;
               }
               NameParts$1 = (FilePath$16).split(Separator$10);
               NameParts$1.splice((NameParts$1.length-1),1)
               ;
               Result = (NameParts$1).join(Separator$10)+Separator$10;
            }
         }
      } else {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid or empty filename (%s) error",[FilePath$16]);
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetExtension(const Filename: String) : String
   ///  [line: 419, column: 34, file: SmartNJ.System]
   ,GetExtension:function(Self, Filename$3) {
      var Result = "";
      var LName$2 = "";
      var Separator$11 = "",
         x$11 = 0;
      var dx$1 = 0;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (Filename$3.length>0) {
         if ((Filename$3.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in filename (\"%s\") error",[Filename$3]);
         } else {
            if (StrEndsWith(Filename$3," ")) {
               TW3ErrorObject.SetLastErrorF(Self,"Invalid trailing character (\" \") in filename (\"%s\") error",[Filename$3]);
            } else {
               Separator$11 = TW3DirectoryParser.GetPathSeparator$(Self);
               if (StrEndsWith(LName$2,Separator$11)) {
                  TW3ErrorObject.SetLastErrorF(Self,"Path (%s) has no filename error",[Filename$3]);
               } else {
                  if ((Filename$3.indexOf(Separator$11)+1)>0) {
                     LName$2 = TW3DirectoryParser.GetFileName$(Self,Filename$3);
                  } else {
                     LName$2 = Filename$3;
                  }
                  if (!TW3ErrorObject.GetFailed(Self)) {
                     for(x$11=Filename$3.length;x$11>=1;x$11--) {
                        {var $temp17 = Filename$3.charAt(x$11-1);
                           if ($temp17==".") {
                              dx$1 = Filename$3.length;
                              (dx$1-= x$11);
                              ++dx$1;
                              Result = RightStr(Filename$3,dx$1);
                              break;
                           }
                            else if ($temp17==Separator$11) {
                              break;
                           }
                        }
                     }
                     if (Result.length<1) {
                        TW3ErrorObject.SetLastErrorF(Self,"Failed to extract extension, filename (%s) contained no postfix",[TW3DirectoryParser.GetFileName$(Self,Filename$3)]);
                     }
                  }
               }
            }
         }
      } else {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid or empty filename (%s) error",[Filename$3]);
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetFileName(const FilePath: String) : String
   ///  [line: 342, column: 34, file: SmartNJ.System]
   ,GetFileName:function(Self, FilePath$17) {
      var Result = "";
      var Separator$12 = "",
         x$12 = 0;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$17.length>0) {
         if ((FilePath$17.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in path (\"%s\") error",[FilePath$17]);
         } else {
            if (StrEndsWith(FilePath$17," ")) {
               TW3ErrorObject.SetLastErrorF(Self,"Invalid trailing character (\" \") in path (\"%s\") error",[FilePath$17]);
            } else {
               Separator$12 = TW3DirectoryParser.GetPathSeparator$(Self);
               if (!StrEndsWith(FilePath$17,Separator$12)) {
                  for(x$12=FilePath$17.length;x$12>=1;x$12--) {
                     if (FilePath$17.charAt(x$12-1)!=Separator$12) {
                        Result = FilePath$17.charAt(x$12-1)+Result;
                     } else {
                        break;
                     }
                  }
               }
            }
         }
      } else {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid or empty path (%s) error",[FilePath$17]);
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetFileNameWithoutExtension(const Filename: String) : String
   ///  [line: 372, column: 34, file: SmartNJ.System]
   ,GetFileNameWithoutExtension:function(Self, Filename$4) {
      var Result = "";
      var Separator$13 = "",
         LName$3 = "";
      var x$13 = 0;
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (Filename$4.length>0) {
         if ((Filename$4.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in filename (\"%s\") error",[Filename$4]);
         } else {
            if (StrEndsWith(Filename$4," ")) {
               TW3ErrorObject.SetLastErrorF(Self,"Invalid trailing character (\" \") in filename (\"%s\") error",[Filename$4]);
            } else {
               Separator$13 = TW3DirectoryParser.GetPathSeparator$(Self);
               if ((Filename$4.indexOf(Separator$13)+1)>0) {
                  LName$3 = TW3DirectoryParser.GetFileName$(Self,Filename$4);
               } else {
                  LName$3 = Filename$4;
               }
               if (!TW3ErrorObject.GetFailed(Self)) {
                  if (LName$3.length>0) {
                     if ((LName$3.indexOf(".")+1)>0) {
                        for(x$13=LName$3.length;x$13>=1;x$13--) {
                           if (LName$3.charAt(x$13-1)==".") {
                              Result = LName$3.substr(0,(x$13-1));
                              break;
                           }
                        }
                     } else {
                        Result = LName$3;
                     }
                  }
               }
            }
         }
      } else {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid or empty filename (%s) error",[Filename$4]);
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetPathName(const FilePath: String) : String
   ///  [line: 274, column: 34, file: SmartNJ.System]
   ,GetPathName:function(Self, FilePath$18) {
      var Result = "";
      var LParts$1 = [],
         LTemp$2 = "";
      var Separator$14 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FilePath$18.length>0) {
         if ((FilePath$18.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in path (\"%s\") error",[FilePath$18]);
         } else {
            if (StrEndsWith(FilePath$18," ")) {
               TW3ErrorObject.SetLastErrorF(Self,"Invalid trailing character (\" \") in path (\"%s\") error",[FilePath$18]);
            } else {
               Separator$14 = TW3DirectoryParser.GetPathSeparator$(Self);
               if (StrEndsWith(FilePath$18,Separator$14)) {
                  if (FilePath$18==TW3DirectoryParser.GetRootMoniker$(Self)) {
                     TW3ErrorObject.SetLastError(Self,"Failed to get directory name, path is root");
                     return Result;
                  }
                  LTemp$2 = (FilePath$18).substr(0,(FilePath$18.length-Separator$14.length));
                  LParts$1 = (LTemp$2).split(Separator$14);
                  Result = LParts$1[(LParts$1.length-1)];
                  return Result;
               }
               LParts$1 = (FilePath$18).split(Separator$14);
               if (LParts$1.length>1) {
                  Result = LParts$1[(LParts$1.length-1)-1];
               } else {
                  Result = LParts$1[(LParts$1.length-1)];
               }
            }
         }
      } else {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid or empty path (%s) error",[FilePath$18]);
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.GetPathSeparator() : Char
   ///  [line: 155, column: 34, file: SmartNJ.System]
   ,GetPathSeparator:function(Self) {
      return "\/";
   }
   /// function TW3PosixDirectoryParser.GetRootMoniker() : String
   ///  [line: 160, column: 35, file: SmartNJ.System]
   ,GetRootMoniker:function(Self) {
      return "\/";
   }
   /// function TW3PosixDirectoryParser.HasValidFileNameChars(FileName: String) : Boolean
   ///  [line: 165, column: 34, file: SmartNJ.System]
   ,HasValidFileNameChars:function(Self, FileName$1) {
      var Result = false;
      var el$2 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (FileName$1.length>0) {
         if ((FileName$1.charAt(0)==" ")) {
            TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in filename (\"%s\") error",[FileName$1]);
         } else {
            for (var $temp18=0;$temp18<FileName$1.length;$temp18++) {
               el$2=$uniCharAt(FileName$1,$temp18);
               if (!el$2) continue;
               Result = (((el$2>="A")&&(el$2<="Z"))||((el$2>="a")&&(el$2<="z"))||((el$2>="0")&&(el$2<="9"))||(el$2=="-")||(el$2=="_")||(el$2==".")||(el$2==" "));
               if (!Result) {
                  TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \"%s\" in filename \"%s\" error",[el$2, FileName$1]);
                  break;
               }
            }
         }
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.HasValidPathChars(FolderName: String) : Boolean
   ///  [line: 194, column: 34, file: SmartNJ.System]
   ,HasValidPathChars:function(Self, FolderName$1) {
      var Result = false;
      var el$3 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if ((FolderName$1.charAt(0)==" ")) {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in directory-name (\"%s\") error",[FolderName$1]);
      } else {
         if (FolderName$1.length>0) {
            for (var $temp19=0;$temp19<FolderName$1.length;$temp19++) {
               el$3=$uniCharAt(FolderName$1,$temp19);
               if (!el$3) continue;
               Result = (((el$3>="A")&&(el$3<="Z"))||((el$3>="a")&&(el$3<="z"))||((el$3>="0")&&(el$3<="9"))||(el$3=="-")||(el$3=="_")||(el$3==".")||(el$3==" "));
               if (!Result) {
                  TW3ErrorObject.SetLastErrorF(Self,"Unexpected character \"%s\" in foldername \"%s\" error",[el$3, FolderName$1]);
                  break;
               }
            }
         }
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.IncludeLeadingPathDelimiter(const FilePath: String) : String
   ///  [line: 587, column: 34, file: SmartNJ.System]
   ,IncludeLeadingPathDelimiter:function(Self, FilePath$19) {
      var Result = "";
      var Separator$15 = "";
      Separator$15 = TW3DirectoryParser.GetPathSeparator$(Self);
      if (StrBeginsWith(FilePath$19,Separator$15)) {
         Result = FilePath$19;
      } else {
         Result = Separator$15+FilePath$19;
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.IncludeTrailingPathDelimiter(const FilePath: String) : String
   ///  [line: 567, column: 34, file: SmartNJ.System]
   ,IncludeTrailingPathDelimiter:function(Self, FilePath$20) {
      var Result = "";
      var Separator$16 = "";
      Separator$16 = TW3DirectoryParser.GetPathSeparator$(Self);
      Result = FilePath$20;
      if (!StrEndsWith(Result,Separator$16)) {
         Result+=Separator$16;
      }
      return Result
   }
   /// function TW3PosixDirectoryParser.IsValidPath(FilePath: String) : Boolean
   ///  [line: 223, column: 34, file: SmartNJ.System]
   ,IsValidPath:function(Self, FilePath$21) {
      var Result = false;
      var Separator$17 = "",
         PathParts$1 = [],
         Index$1 = 0,
         a$205 = 0;
      var part$1 = "";
      if (TW3ErrorObject.GetFailed(Self)) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if ((FilePath$21.charAt(0)==" ")) {
         TW3ErrorObject.SetLastErrorF(Self,"Invalid leading character (\" \") in path (\"%s\") error",[FilePath$21]);
      } else {
         if (FilePath$21.length>0) {
            Separator$17 = TW3DirectoryParser.GetPathSeparator$(Self);
            PathParts$1 = (FilePath$21).split(Separator$17);
            Index$1 = 0;
            var $temp20;
            for(a$205=0,$temp20=PathParts$1.length;a$205<$temp20;a$205++) {
               part$1 = PathParts$1[a$205];
               {var $temp21 = part$1;
                  if ($temp21=="") {
                     TW3ErrorObject.SetLastErrorF(Self,"Path has multiple separators (%s) error",[FilePath$21]);
                     return false;
                  }
                   else if ($temp21=="~") {
                     if (Index$1>0) {
                        TW3ErrorObject.SetLastErrorF(Self,"Path has misplaced root moniker (%s) error",[FilePath$21]);
                        return Result;
                     }
                  }
                   else {
                     if (Index$1==(PathParts$1.length-1)) {
                        if (!TW3DirectoryParser.HasValidFileNameChars$(Self,part$1)) {
                           return Result;
                        }
                     } else if (!TW3DirectoryParser.HasValidPathChars$(Self,part$1)) {
                        return Result;
                     }
                  }
               }
               Index$1+=1;
            }
            Result = true;
         }
      }
      return Result
   }
   ,Destroy:TW3ErrorObject.Destroy
   ,ChangeFileExt$:function($){return $.ClassType.ChangeFileExt.apply($.ClassType, arguments)}
   ,ExcludeLeadingPathDelimiter$:function($){return $.ClassType.ExcludeLeadingPathDelimiter.apply($.ClassType, arguments)}
   ,ExcludeTrailingPathDelimiter$:function($){return $.ClassType.ExcludeTrailingPathDelimiter.apply($.ClassType, arguments)}
   ,GetDevice$:function($){return $.ClassType.GetDevice.apply($.ClassType, arguments)}
   ,GetDirectoryName$:function($){return $.ClassType.GetDirectoryName.apply($.ClassType, arguments)}
   ,GetExtension$:function($){return $.ClassType.GetExtension.apply($.ClassType, arguments)}
   ,GetFileName$:function($){return $.ClassType.GetFileName.apply($.ClassType, arguments)}
   ,GetFileNameWithoutExtension$:function($){return $.ClassType.GetFileNameWithoutExtension.apply($.ClassType, arguments)}
   ,GetPathName$:function($){return $.ClassType.GetPathName.apply($.ClassType, arguments)}
   ,GetPathSeparator$:function($){return $.ClassType.GetPathSeparator($)}
   ,GetRootMoniker$:function($){return $.ClassType.GetRootMoniker($)}
   ,HasValidFileNameChars$:function($){return $.ClassType.HasValidFileNameChars.apply($.ClassType, arguments)}
   ,HasValidPathChars$:function($){return $.ClassType.HasValidPathChars.apply($.ClassType, arguments)}
   ,IncludeLeadingPathDelimiter$:function($){return $.ClassType.IncludeLeadingPathDelimiter.apply($.ClassType, arguments)}
   ,IncludeTrailingPathDelimiter$:function($){return $.ClassType.IncludeTrailingPathDelimiter.apply($.ClassType, arguments)}
   ,IsValidPath$:function($){return $.ClassType.IsValidPath.apply($.ClassType, arguments)}
};
TW3PosixDirectoryParser.$Intf={
   IW3DirectoryParser:[TW3PosixDirectoryParser.GetPathSeparator,TW3PosixDirectoryParser.GetRootMoniker,TW3DirectoryParser.GetErrorObject,TW3PosixDirectoryParser.IsValidPath,TW3PosixDirectoryParser.HasValidPathChars,TW3PosixDirectoryParser.HasValidFileNameChars,TW3DirectoryParser.IsRelativePath,TW3DirectoryParser.IsPathRooted,TW3PosixDirectoryParser.GetFileNameWithoutExtension,TW3PosixDirectoryParser.GetPathName,TW3PosixDirectoryParser.GetDevice,TW3PosixDirectoryParser.GetFileName,TW3PosixDirectoryParser.GetExtension,TW3PosixDirectoryParser.GetDirectoryName,TW3PosixDirectoryParser.IncludeTrailingPathDelimiter,TW3PosixDirectoryParser.IncludeLeadingPathDelimiter,TW3PosixDirectoryParser.ExcludeLeadingPathDelimiter,TW3PosixDirectoryParser.ExcludeTrailingPathDelimiter,TW3PosixDirectoryParser.ChangeFileExt]
   ,IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TW3EnvVariables = class (TObject)
///  [line: 92, column: 3, file: SmartNJ.System]
var TW3EnvVariables = {
   $ClassName:"TW3EnvVariables",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TRunPlatform enumeration
///  [line: 35, column: 3, file: SmartNJ.System]
var TRunPlatform = [ "rpUnknown", "rpWindows", "rpLinux", "rpMac", "rpEspruino" ];
function PathSeparator() {
   return NodePathAPI().sep;
};
function ParamStr$1(index$1) {
   var Result = "";
   Result = process.argv[index$1];
   return Result
};
function IncludeTrailingPathDelimiter$4(PathName) {
   var Result = "";
   Result = Trim$_String_(PathName);
   if (!StrEndsWith(Result,PathSeparator())) {
      Result+=PathSeparator();
   }
   return Result
};
function GetPlatform() {
   var Result = 0;
   var token = "";
   token = process.platform;
   token = (Trim$_String_(token)).toLocaleLowerCase();
   {var $temp22 = token;
      if ($temp22=="darwin") {
         Result = 3;
      }
       else if ($temp22=="win32") {
         Result = 1;
      }
       else if ($temp22=="linux") {
         Result = 2;
      }
       else if ($temp22=="espruino") {
         Result = 4;
      }
       else {
         Result = 0;
      }
   }
   return Result
};
/// TPath = class (TObject)
///  [line: 107, column: 3, file: System.IOUtils]
var TPath = {
   $ClassName:"TPath",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TPath.GetDevice(const FilePath: String) : String
   ///  [line: 268, column: 22, file: System.IOUtils]
   ,GetDevice$3:function(FilePath$22) {
      var Result = "";
      var Access$2 = null,
         Error$1 = null;
      Access$2 = GetDirectoryParser();
      Error$1 = Access$2[2]();
      Result = Access$2[10](FilePath$22);
      if (Error$1[0]()) {
         throw Exception.Create($New(EPathError),Error$1[1]());
      }
      return Result
   }
   /// function TPath.IsPathRooted(const FilePath: String) : Boolean
   ///  [line: 257, column: 22, file: System.IOUtils]
   ,IsPathRooted$1:function(FilePath$23) {
      var Result = false;
      var Access$3 = null,
         Error$2 = null;
      Access$3 = GetDirectoryParser();
      Error$2 = Access$3[2]();
      Result = Access$3[7](FilePath$23);
      if (Error$2[0]()) {
         throw Exception.Create($New(EPathError),Error$2[1]());
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
function InstallDirectoryParser(NewParser) {
   if (__Parser!==null) {
      TObject.Free(__Parser);
      __Parser = null;
   }
   __Parser = NewParser;
};
function GetDirectoryParser() {
   var Result = null;
   if (__Parser===null) {
      if (GetIsRunningInBrowser()) {
         __Parser = TW3ErrorObject.Create$31($New(TW3UnixDirectoryParser));
      }
   }
   if (__Parser!==null) {
      Result = $AsIntf(__Parser,"IW3DirectoryParser");
   } else {
      Result = null;
   }
   return Result
};
/// EPathError = class (EW3Exception)
///  [line: 105, column: 3, file: System.IOUtils]
var EPathError = {
   $ClassName:"EPathError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3OwnedErrorObject = class (TW3OwnedObject)
///  [line: 78, column: 3, file: System.Objects]
var TW3OwnedErrorObject = {
   $ClassName:"TW3OwnedErrorObject",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FLastError$1 = "";
      $.FOptions$4 = null;
   }
   /// procedure TW3OwnedErrorObject.ClearLastError()
   ///  [line: 279, column: 31, file: System.Objects]
   ,ClearLastError$1:function(Self) {
      Self.FLastError$1 = "";
   }
   /// constructor TW3OwnedErrorObject.Create(const AOwner: TObject)
   ///  [line: 227, column: 33, file: System.Objects]
   ,Create$13:function(Self, AOwner$2) {
      TW3OwnedObject.Create$13(Self,AOwner$2);
      Self.FOptions$4 = TW3ErrorObjectOptions.Create$37($New(TW3ErrorObjectOptions));
      return Self
   }
   /// destructor TW3OwnedErrorObject.Destroy()
   ///  [line: 233, column: 32, file: System.Objects]
   ,Destroy:function(Self) {
      TObject.Free(Self.FOptions$4);
      TObject.Destroy(Self);
   }
   /// function TW3OwnedErrorObject.GetFailed() : Boolean
   ///  [line: 244, column: 30, file: System.Objects]
   ,GetFailed$1:function(Self) {
      return Self.FLastError$1.length>0;
   }
   /// procedure TW3OwnedErrorObject.SetLastError(const ErrorText: String)
   ///  [line: 249, column: 31, file: System.Objects]
   ,SetLastError$1:function(Self, ErrorText$3) {
      Self.FLastError$1 = Trim$_String_(ErrorText$3);
      if (Self.FLastError$1.length>0) {
         if (Self.FOptions$4.AutoWriteToConsole) {
            if (console) {
          console.log( (Self.FLastError$1) );
        }
         }
         if (Self.FOptions$4.ThrowExceptions) {
            throw Exception.Create($New(EW3ErrorObject),Self.FLastError$1);
         }
      }
   }
   /// procedure TW3OwnedErrorObject.SetLastErrorF(const ErrorText: String; const Values: array of const)
   ///  [line: 273, column: 31, file: System.Objects]
   ,SetLastErrorF$1:function(Self, ErrorText$4, Values$3) {
      Self.FLastError$1 = Format(ErrorText$4,Values$3.slice(0));
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13$:function($){return $.ClassType.Create$13.apply($.ClassType, arguments)}
};
TW3OwnedErrorObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3OwnedLockedErrorObject = class (TW3OwnedErrorObject)
///  [line: 96, column: 3, file: System.Objects]
var TW3OwnedLockedErrorObject = {
   $ClassName:"TW3OwnedLockedErrorObject",$Parent:TW3OwnedErrorObject
   ,$Init:function ($) {
      TW3OwnedErrorObject.$Init($);
      $.OnObjectUnLocked = null;
      $.OnObjectLocked = null;
      $.FLocked$2 = 0;
   }
   /// procedure TW3OwnedLockedErrorObject.DisableAlteration()
   ///  [line: 189, column: 37, file: System.Objects]
   ,DisableAlteration$2:function(Self) {
      ++Self.FLocked$2;
      if (Self.FLocked$2==1) {
         TW3OwnedLockedErrorObject.ObjectLocked$2(Self);
      }
   }
   /// procedure TW3OwnedLockedErrorObject.EnableAlteration()
   ///  [line: 196, column: 37, file: System.Objects]
   ,EnableAlteration$2:function(Self) {
      if (Self.FLocked$2>0) {
         --Self.FLocked$2;
         if (!Self.FLocked$2) {
            TW3OwnedLockedErrorObject.ObjectUnLocked$2(Self);
         }
      }
   }
   /// function TW3OwnedLockedErrorObject.GetLockState() : Boolean
   ///  [line: 206, column: 36, file: System.Objects]
   ,GetLockState$2:function(Self) {
      return Self.FLocked$2>0;
   }
   /// procedure TW3OwnedLockedErrorObject.ObjectLocked()
   ///  [line: 211, column: 37, file: System.Objects]
   ,ObjectLocked$2:function(Self) {
      if (Self.OnObjectLocked) {
         Self.OnObjectLocked(Self);
      }
   }
   /// procedure TW3OwnedLockedErrorObject.ObjectUnLocked()
   ///  [line: 217, column: 37, file: System.Objects]
   ,ObjectUnLocked$2:function(Self) {
      if (Self.OnObjectUnLocked) {
         Self.OnObjectUnLocked(Self);
      }
   }
   ,Destroy:TW3OwnedErrorObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13:TW3OwnedErrorObject.Create$13
};
TW3OwnedLockedErrorObject.$Intf={
   IW3LockObject:[TW3OwnedLockedErrorObject.DisableAlteration$2,TW3OwnedLockedErrorObject.EnableAlteration$2,TW3OwnedLockedErrorObject.GetLockState$2]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3HandleBasedObject = class (TObject)
///  [line: 115, column: 3, file: System.Objects]
var TW3HandleBasedObject = {
   $ClassName:"TW3HandleBasedObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FHandle$3 = undefined;
   }
   /// procedure TW3HandleBasedObject.ObjectHandleChanged(const PreviousHandle: THandle; const NewHandle: THandle)
   ///  [line: 160, column: 32, file: System.Objects]
   ,ObjectHandleChanged:function(Self, PreviousHandle, NewHandle) {
      /* null */
   }
   /// function TW3HandleBasedObject.AcceptObjectHandle(const CandidateHandle: THandle) : Boolean
   ///  [line: 154, column: 31, file: System.Objects]
   ,AcceptObjectHandle:function(Self, CandidateHandle) {
      return true;
   }
   /// procedure TW3HandleBasedObject.SetObjectHandle(const NewHandle: THandle)
   ///  [line: 173, column: 32, file: System.Objects]
   ,SetObjectHandle:function(Self, NewHandle$1) {
      var LTemp$3 = undefined;
      if (TW3HandleBasedObject.AcceptObjectHandle(Self,NewHandle$1)) {
         LTemp$3 = Self.FHandle$3;
         Self.FHandle$3 = NewHandle$1;
         TW3HandleBasedObject.ObjectHandleChanged(Self,LTemp$3,Self.FHandle$3);
      } else {
         throw EW3Exception.CreateFmt($New(EW3HandleBasedObject),$R[28],["TW3HandleBasedObject.SetObjectHandle"]);
      }
   }
   /// function TW3HandleBasedObject.GetObjectHandle() : THandle
   ///  [line: 168, column: 31, file: System.Objects]
   ,GetObjectHandle:function(Self) {
      return Self.FHandle$3;
   }
   ,Destroy:TObject.Destroy
};
/// TW3ErrorObjectOptions = class (TObject)
///  [line: 27, column: 3, file: System.Objects]
var TW3ErrorObjectOptions = {
   $ClassName:"TW3ErrorObjectOptions",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.AutoWriteToConsole = $.ThrowExceptions = $.AutoResetError = false;
   }
   /// constructor TW3ErrorObjectOptions.Create()
   ///  [line: 139, column: 35, file: System.Objects]
   ,Create$37:function(Self) {
      Self.AutoResetError = true;
      Self.AutoWriteToConsole = false;
      Self.ThrowExceptions = false;
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// EW3HandleBasedObject = class (EW3Exception)
///  [line: 113, column: 3, file: System.Objects]
var EW3HandleBasedObject = {
   $ClassName:"EW3HandleBasedObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3ErrorObject = class (EW3Exception)
///  [line: 21, column: 3, file: System.Objects]
var EW3ErrorObject = {
   $ClassName:"EW3ErrorObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3CustomComponent = class (TW3OwnedLockedErrorObject)
///  [line: 19, column: 3, file: System.Widget]
var TW3CustomComponent = {
   $ClassName:"TW3CustomComponent",$Parent:TW3OwnedLockedErrorObject
   ,$Init:function ($) {
      TW3OwnedLockedErrorObject.$Init($);
      $.FInitialized = false;
   }
   /// constructor TW3CustomComponent.Create(const AOwner: TObject)
   ///  [line: 73, column: 32, file: System.Widget]
   ,Create$13:function(Self, AOwner$3) {
      TW3OwnedErrorObject.Create$13(Self,AOwner$3);
      Self.FInitialized = true;
      TW3CustomComponent.InitializeObject$(Self);
      return Self
   }
   /// constructor TW3CustomComponent.CreateEx(const AOwner: TObject)
   ///  [line: 88, column: 32, file: System.Widget]
   ,CreateEx:function(Self, AOwner$4) {
      TW3OwnedErrorObject.Create$13(Self,AOwner$4);
      Self.FInitialized = false;
      return Self
   }
   /// destructor TW3CustomComponent.Destroy()
   ///  [line: 99, column: 31, file: System.Widget]
   ,Destroy:function(Self) {
      if (Self.FInitialized) {
         TW3CustomComponent.FinalizeObject$(Self);
      }
      TW3OwnedErrorObject.Destroy(Self);
   }
   /// procedure TW3CustomComponent.FinalizeObject()
   ///  [line: 116, column: 30, file: System.Widget]
   ,FinalizeObject:function(Self) {
      /* null */
   }
   /// procedure TW3CustomComponent.InitializeObject()
   ///  [line: 106, column: 30, file: System.Widget]
   ,InitializeObject:function(Self) {
      /* null */
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13$:function($){return $.ClassType.Create$13.apply($.ClassType, arguments)}
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
};
TW3CustomComponent.$Intf={
   IW3LockObject:[TW3OwnedLockedErrorObject.DisableAlteration$2,TW3OwnedLockedErrorObject.EnableAlteration$2,TW3OwnedLockedErrorObject.GetLockState$2]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3Component = class (TW3CustomComponent)
///  [line: 57, column: 3, file: System.Widget]
var TW3Component = {
   $ClassName:"TW3Component",$Parent:TW3CustomComponent
   ,$Init:function ($) {
      TW3CustomComponent.$Init($);
   }
   ,Destroy:TW3CustomComponent.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13:TW3CustomComponent.Create$13
   ,FinalizeObject:TW3CustomComponent.FinalizeObject
   ,InitializeObject:TW3CustomComponent.InitializeObject
};
TW3Component.$Intf={
   IW3LockObject:[TW3OwnedLockedErrorObject.DisableAlteration$2,TW3OwnedLockedErrorObject.EnableAlteration$2,TW3OwnedLockedErrorObject.GetLockState$2]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3RepeatResult enumeration
///  [line: 55, column: 3, file: System.Time]
var TW3RepeatResult = { 241:"rrContinue", 242:"rrStop", 243:"rrDispose" };
/// TW3CustomRepeater = class (TObject)
///  [line: 71, column: 3, file: System.Time]
var TW3CustomRepeater = {
   $ClassName:"TW3CustomRepeater",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FActive = false;
      $.FDelay$1 = 0;
      $.FHandle$2 = undefined;
   }
   /// procedure TW3CustomRepeater.AllocTimer()
   ///  [line: 446, column: 29, file: System.Time]
   ,AllocTimer:function(Self) {
      if (Self.FHandle$2) {
         TW3CustomRepeater.FreeTimer(Self);
      }
      Self.FHandle$2 = TW3Dispatch.SetInterval(TW3Dispatch,$Event0(Self,TW3CustomRepeater.CBExecute$),Self.FDelay$1);
   }
   /// destructor TW3CustomRepeater.Destroy()
   ///  [line: 400, column: 30, file: System.Time]
   ,Destroy:function(Self) {
      if (Self.FActive) {
         TW3CustomRepeater.SetActive(Self,false);
      }
      TObject.Destroy(Self);
   }
   /// procedure TW3CustomRepeater.FreeTimer()
   ///  [line: 455, column: 29, file: System.Time]
   ,FreeTimer:function(Self) {
      if (Self.FHandle$2) {
         TW3Dispatch.ClearInterval(TW3Dispatch,Self.FHandle$2);
         Self.FHandle$2 = undefined;
      }
   }
   /// procedure TW3CustomRepeater.SetActive(const NewActive: Boolean)
   ///  [line: 414, column: 29, file: System.Time]
   ,SetActive:function(Self, NewActive) {
      if (NewActive!=Self.FActive) {
         try {
            if (Self.FActive) {
               TW3CustomRepeater.FreeTimer(Self);
            } else {
               TW3CustomRepeater.AllocTimer(Self);
            }
         } finally {
            Self.FActive = NewActive;
         }
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,CBExecute$:function($){return $.ClassType.CBExecute($)}
};
/// TW3Dispatch = class (TObject)
///  [line: 135, column: 3, file: System.Time]
var TW3Dispatch = {
   $ClassName:"TW3Dispatch",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// procedure TW3Dispatch.ClearInterval(const Handle: TW3DispatchHandle)
   ///  [line: 234, column: 29, file: System.Time]
   ,ClearInterval:function(Self, Handle$5) {
      clearInterval(Handle$5);
   }
   /// function TW3Dispatch.Execute(const EntryPoint: TProcedureRef; const WaitForInMs: Integer) : TW3DispatchHandle
   ///  [line: 264, column: 28, file: System.Time]
   ,Execute:function(Self, EntryPoint, WaitForInMs) {
      var Result = undefined;
      Result = setTimeout(EntryPoint,WaitForInMs);
      return Result
   }
   /// procedure TW3Dispatch.RepeatExecute(const Entrypoint: TProcedureRef; const RepeatCount: Integer; const IntervalInMs: Integer)
   ///  [line: 272, column: 29, file: System.Time]
   ,RepeatExecute:function(Self, Entrypoint$1, RepeatCount, IntervalInMs) {
      if (Entrypoint$1) {
         if (RepeatCount>0) {
            Entrypoint$1();
            if (RepeatCount>1) {
               TW3Dispatch.Execute(Self,function () {
                  TW3Dispatch.RepeatExecute(Self,Entrypoint$1,(RepeatCount-1),IntervalInMs);
               },IntervalInMs);
            }
         } else {
            Entrypoint$1();
            TW3Dispatch.Execute(Self,function () {
               TW3Dispatch.RepeatExecute(Self,Entrypoint$1,(-1),IntervalInMs);
            },IntervalInMs);
         }
      }
   }
   /// function TW3Dispatch.SetInterval(const Entrypoint: TProcedureRef; const IntervalDelayInMS: Integer) : TW3DispatchHandle
   ///  [line: 226, column: 28, file: System.Time]
   ,SetInterval:function(Self, Entrypoint$2, IntervalDelayInMS) {
      var Result = undefined;
      Result = setInterval(Entrypoint$2,IntervalDelayInMS);
      return Result
   }
   ,Destroy:TObject.Destroy
};
function JDateToDateTime(Obj) {
   return Obj.getTime()/86400000+25569;
};
function DateTimeToJDate(Present) {
   var Result = null;
   Result = new Date();
   Result.setTime(Math.round((Present-25569)*86400000));
   return Result
};
var CNT_DaysInMonthData = [[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]];
/// TBinaryData = class (TAllocation)
///  [line: 126, column: 3, file: System.Memory.Buffer]
var TBinaryData = {
   $ClassName:"TBinaryData",$Parent:TAllocation
   ,$Init:function ($) {
      TAllocation.$Init($);
      $.FDataView = null;
   }
   /// procedure TBinaryData.AppendBuffer(const Raw: TMemoryHandle)
   ///  [line: 950, column: 23, file: System.Memory.Buffer]
   ,AppendBuffer:function(Self, Raw) {
      var mOffset = 0;
      if (Raw) {
         if (Raw.length>0) {
            mOffset = TAllocation.GetSize$3(Self);
            TAllocation.Grow(Self,Raw.length);
            TBinaryData.Write$5(Self,mOffset,Raw);
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Append failed, invalid source handle error");
      }
   }
   /// procedure TBinaryData.AppendBytes(const Bytes: TByteArray)
   ///  [line: 1019, column: 23, file: System.Memory.Buffer]
   ,AppendBytes:function(Self, Bytes$4) {
      var mLen$1 = 0;
      var mOffset$1 = 0;
      mLen$1 = Bytes$4.length;
      if (mLen$1>0) {
         mOffset$1 = TAllocation.GetSize$3(Self);
         TAllocation.Grow(Self,mLen$1);
         TAllocation.GetHandle(Self).set(Bytes$4,mOffset$1);
      }
   }
   /// procedure TBinaryData.AppendFloat32(const Value: float32)
   ///  [line: 931, column: 23, file: System.Memory.Buffer]
   ,AppendFloat32:function(Self, Value$17) {
      var mOffset$2 = 0;
      mOffset$2 = TAllocation.GetSize$3(Self);
      TAllocation.Grow(Self,TDatatype.SizeOfType(TDatatype,8));
      TBinaryData.WriteFloat32(Self,mOffset$2,Value$17);
   }
   /// procedure TBinaryData.AppendFloat64(const Value: float64)
   ///  [line: 940, column: 23, file: System.Memory.Buffer]
   ,AppendFloat64:function(Self, Value$18) {
      var mOffset$3 = 0;
      mOffset$3 = TAllocation.GetSize$3(Self);
      TAllocation.Grow(Self,TDatatype.SizeOfType(TDatatype,9));
      TBinaryData.WriteFloat64(Self,mOffset$3,Value$18);
   }
   /// procedure TBinaryData.AppendMemory(const Buffer: TBinaryData; const ReleaseBufferOnExit: Boolean)
   ///  [line: 967, column: 23, file: System.Memory.Buffer]
   ,AppendMemory:function(Self, Buffer$5, ReleaseBufferOnExit) {
      var mOffset$4 = 0;
      if (Buffer$5!==null) {
         try {
            if (TAllocation.GetSize$3(Buffer$5)>0) {
               mOffset$4 = TAllocation.GetSize$3(Self);
               TAllocation.Grow(Self,TAllocation.GetSize$3(Buffer$5));
               TBinaryData.Write$4(Self,mOffset$4,Buffer$5);
            }
         } finally {
            if (ReleaseBufferOnExit) {
               TObject.Free(Buffer$5);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Append failed, Invalid source buffer error");
      }
   }
   /// procedure TBinaryData.AppendStr(const Text: String)
   ///  [line: 990, column: 23, file: System.Memory.Buffer]
   ,AppendStr:function(Self, Text$3) {
      var mLen$2 = 0;
      var x$14 = 0;
      var mOffset$5 = 0;
      var LTemp$4 = [];
      mLen$2 = Text$3.length;
      if (mLen$2>0) {
         mOffset$5 = TAllocation.GetSize$3(Self);
         LTemp$4 = TString.EncodeUTF8(TString,Text$3);
         TAllocation.Grow(Self,LTemp$4.length);
         var $temp23;
         for(x$14=0,$temp23=LTemp$4.length;x$14<$temp23;x$14++) {
            Self.FDataView.setInt8(mOffset$5,LTemp$4[x$14]);
            ++mOffset$5;
            console.log( LTemp$4[x$14] );
         }
      }
   }
   /// function TBinaryData.Clone() : TBinaryData
   ///  [line: 897, column: 22, file: System.Memory.Buffer]
   ,Clone:function(Self) {
      return TBinaryData.Create$43($New(TBinaryData),TBinaryData.ToTypedArray(Self));
   }
   /// procedure TBinaryData.CopyFrom(const Buffer: TBinaryData; const Offset: Integer; const ByteLen: Integer)
   ///  [line: 902, column: 23, file: System.Memory.Buffer]
   ,CopyFrom$2:function(Self, Buffer$6, Offset$13, ByteLen) {
      if (Buffer$6!==null) {
         TBinaryData.CopyFromMemory(Self,TAllocation.GetHandle(Buffer$6),Offset$13,ByteLen);
      } else {
         throw Exception.Create($New(EBinaryData),"CopyFrom failed, source instance was NIL error");
      }
   }
   /// procedure TBinaryData.CopyFromMemory(const Raw: TMemoryHandle; Offset: Integer; ByteLen: Integer)
   ///  [line: 913, column: 23, file: System.Memory.Buffer]
   ,CopyFromMemory:function(Self, Raw$1, Offset$14, ByteLen$1) {
      if (TMemoryHandleHelper$Valid$3(Raw$1)) {
         if (TBinaryData.OffsetInRange(Self,Offset$14)) {
            if (ByteLen$1>0) {
               TMarshal.Move$1(TMarshal,Raw$1,0,TAllocation.GetHandle(Self),Offset$14,ByteLen$1);
            }
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Cut memory failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$14]);
         }
      } else {
         throw Exception.Create($New(EBinaryData),"CopyFrom failed, invalid source handle error");
      }
   }
   /// constructor TBinaryData.Create(aHandle: TMemoryHandle)
   ///  [line: 239, column: 25, file: System.Memory.Buffer]
   ,Create$43:function(Self, aHandle) {
      var LSignature$1;
      TAllocation.Create$27(Self);
      if (TMemoryHandleHelper$Defined(aHandle)&&TMemoryHandleHelper$Valid$3(aHandle)) {
         if (aHandle.toString) {
            LSignature$1 = aHandle.toString();
            if (SameText(String(LSignature$1),"[object Uint8Array]")||SameText(String(LSignature$1),"[object Uint8ClampedArray]")) {
               TAllocation.Allocate$1(Self,parseInt(aHandle.length,10));
               TMarshal.Move$1(TMarshal,aHandle,0,TAllocation.GetHandle(Self),0,parseInt(aHandle.length,10));
            } else {
               throw Exception.Create($New(EBinaryData),"Invalid buffer type, expected handle of type Uint8[clamped]Array");
            }
         } else {
            throw Exception.Create($New(EBinaryData),"Invalid buffer type, expected handle of type Uint8[clamped]Array");
         }
      }
      return Self
   }
   /// function TBinaryData.CutBinaryData(Offset: Integer; ByteLen: Integer) : TBinaryData
   ///  [line: 878, column: 22, file: System.Memory.Buffer]
   ,CutBinaryData:function(Self, Offset$15, ByteLen$2) {
      var Result = null;
      var mNewBuffer = undefined;
      if (ByteLen$2>0) {
         if (TBinaryData.OffsetInRange(Self,Offset$15)) {
            mNewBuffer = TAllocation.GetHandle(Self).subarray(Offset$15,Offset$15+ByteLen$2-1);
            Result = TBinaryData.Create$43($New(TBinaryData),mNewBuffer);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Cut memory failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$15]);
         }
      } else {
         Result = TBinaryData.Create$43($New(TBinaryData),null);
      }
      return Result
   }
   /// function TBinaryData.CutStream(const Offset: Integer; const ByteLen: Integer) : TStream
   ///  [line: 851, column: 22, file: System.Memory.Buffer]
   ,CutStream:function(Self, Offset$16, ByteLen$3) {
      return TBinaryData.ToStream(TBinaryData.CutBinaryData(Self,Offset$16,ByteLen$3));
   }
   /// function TBinaryData.CutTypedArray(Offset: Integer; ByteLen: Integer) : TMemoryHandle
   ///  [line: 857, column: 22, file: System.Memory.Buffer]
   ,CutTypedArray:function(Self, Offset$17, ByteLen$4) {
      var Result = undefined;
      var mTemp$3 = null;
      Result = null;
      if (ByteLen$4>0) {
         if (TBinaryData.OffsetInRange(Self,Offset$17)) {
            if (TAllocation.GetSize$3(Self)-Offset$17>0) {
               mTemp$3 = Self.FDataView.buffer.slice(Offset$17,Offset$17+ByteLen$4);
               Result = new Uint8ClampedArray(mTemp$3);
            }
         }
      }
      return Result
   }
   /// procedure TBinaryData.FromBase64(FileData: String)
   ///  [line: 467, column: 23, file: System.Memory.Buffer]
   ,FromBase64:function(Self, FileData) {
      var mRaw$2 = "";
      var x$15 = 0;
      TAllocation.Release$2(Self);
      if (FileData.length>0) {
         mRaw$2 = atob(FileData);
         if (mRaw$2.length>0) {
            TAllocation.Allocate$1(Self,mRaw$2.length);
            var $temp24;
            for(x$15=0,$temp24=mRaw$2.length;x$15<$temp24;x$15++) {
               TBinaryData.SetByte(Self,x$15,TDatatype.CharToByte(TDatatype,mRaw$2.charAt(x$15-1)));
            }
         }
      }
   }
   /// procedure TBinaryData.FromNodeBuffer(const NodeBuffer: JNodeBuffer)
   ///  [line: 103, column: 23, file: SmartNJ.Streams]
   ,FromNodeBuffer:function(Self, NodeBuffer) {
      var LTypedAccess = undefined;
      if (!TAllocation.a$28(Self)) {
         TAllocation.Release$2(Self);
      }
      if (NodeBuffer!==null) {
         LTypedAccess = new Uint8Array(NodeBuffer);
         TBinaryData.AppendBuffer(Self,LTypedAccess);
      }
   }
   /// function TBinaryData.GetBit(const bitIndex: Integer) : Boolean
   ///  [line: 320, column: 22, file: System.Memory.Buffer]
   ,GetBit$1:function(Self, bitIndex) {
      var Result = false;
      var mOffset$6 = 0;
      mOffset$6 = bitIndex>>>3;
      if (TBinaryData.OffsetInRange(Self,mOffset$6)) {
         Result = TBitAccess.Get(TBitAccess,(bitIndex%8),TBinaryData.GetByte(Self,mOffset$6));
      }
      return Result
   }
   /// function TBinaryData.GetBitCount() : Integer
   ///  [line: 277, column: 22, file: System.Memory.Buffer]
   ,GetBitCount:function(Self) {
      return TAllocation.GetSize$3(Self)<<3;
   }
   /// function TBinaryData.GetByte(const Index: Integer) : Byte
   ///  [line: 539, column: 22, file: System.Memory.Buffer]
   ,GetByte:function(Self, Index$2) {
      var Result = 0;
      if (TAllocation.GetHandle(Self)) {
         if (TBinaryData.OffsetInRange(Self,Index$2)) {
            Result = Self.FDataView.getUint8(Index$2);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"invalid byte index, expected %d..%d, not %d",[0, TAllocation.GetHandle(Self).length-1, Index$2]);
         }
      }
      return Result
   }
   /// procedure TBinaryData.HandleAllocated()
   ///  [line: 267, column: 23, file: System.Memory.Buffer]
   ,HandleAllocated:function(Self) {
      var LRef = undefined;
      LRef = TAllocation.GetBufferHandle(Self);
      (Self.FDataView) = new DataView(LRef);
   }
   /// procedure TBinaryData.HandleReleased()
   ///  [line: 282, column: 23, file: System.Memory.Buffer]
   ,HandleReleased:function(Self) {
      Self.FDataView = null;
   }
   /// procedure TBinaryData.LoadFromStream(const Stream: TStream)
   ///  [line: 418, column: 23, file: System.Memory.Buffer]
   ,LoadFromStream:function(Self, Stream$1) {
      var BytesToRead$2 = 0;
      if (Stream$1!==null) {
         BytesToRead$2 = TStream.GetSize$1$(Stream$1)-TStream.GetPosition$(Stream$1);
         if (BytesToRead$2>0) {
            TAllocation.Release$2(Self);
            TBinaryData.AppendBytes(Self,TStream.ReadBuffer$(Stream$1,0,TStream.GetSize$1$(Stream$1)));
         }
      } else {
         throw Exception.Create($New(EBinaryData),$R[27]);
      }
   }
   /// function TBinaryData.OffsetInRange(Offset: Integer) : Boolean
   ///  [line: 656, column: 22, file: System.Memory.Buffer]
   ,OffsetInRange:function(Self, Offset$18) {
      var Result = false;
      var mSize$3 = 0;
      mSize$3 = TAllocation.GetSize$3(Self);
      if (mSize$3>0) {
         Result = Offset$18>=0&&Offset$18<=mSize$3;
      } else {
         Result = (Offset$18==0);
      }
      return Result
   }
   /// function TBinaryData.ReadBool(Offset: Integer) : Boolean
   ///  [line: 648, column: 22, file: System.Memory.Buffer]
   ,ReadBool:function(Self, Offset$19) {
      var Result = false;
      if (TBinaryData.OffsetInRange(Self,Offset$19)) {
         Result = Self.FDataView.getUint8(Offset$19)>0;
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[25],[Offset$19, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadBytes(Offset: Integer; ByteLen: Integer) : TByteArray
   ///  [line: 630, column: 22, file: System.Memory.Buffer]
   ,ReadBytes:function(Self, Offset$20, ByteLen$5) {
      var Result = [];
      var x$16 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$20)) {
         if (Offset$20+ByteLen$5<=TAllocation.GetSize$3(Self)) {
            var $temp25;
            for(x$16=0,$temp25=ByteLen$5;x$16<$temp25;x$16++) {
               Result.push(Self.FDataView.getUint8(Offset$20+x$16));
            }
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[25],[Offset$20, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadFloat32(Offset: Integer) : Float
   ///  [line: 577, column: 22, file: System.Memory.Buffer]
   ,ReadFloat32:function(Self, Offset$21) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$21)) {
         if (Offset$21+TDatatype.SizeOfType(TDatatype,8)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getFloat32(Offset$21,a$4);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[25],[Offset$21, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadFloat64(Offset: Integer) : Float
   ///  [line: 563, column: 22, file: System.Memory.Buffer]
   ,ReadFloat64:function(Self, Offset$22) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$22)) {
         if (Offset$22+TDatatype.SizeOfType(TDatatype,9)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getFloat64(Offset$22,a$4);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[25],[Offset$22, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadInt(Offset: Integer) : Integer
   ///  [line: 591, column: 22, file: System.Memory.Buffer]
   ,ReadInt:function(Self, Offset$23) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$23)) {
         if (Offset$23+TDatatype.SizeOfType(TDatatype,7)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getUint32(Offset$23,a$4);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[25],[Offset$23, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadStr(Offset: Integer; ByteLen: Integer) : String
   ///  [line: 605, column: 22, file: System.Memory.Buffer]
   ,ReadStr$1:function(Self, Offset$24, ByteLen$6) {
      var Result = "";
      var x$17 = 0;
      var LFetch = [];
      Result = "";
      if (TBinaryData.OffsetInRange(Self,Offset$24)) {
         if (Offset$24+ByteLen$6<=TAllocation.GetSize$3(Self)) {
            var $temp26;
            for(x$17=0,$temp26=ByteLen$6;x$17<$temp26;x$17++) {
               LFetch.push(TBinaryData.GetByte(Self,(Offset$24+x$17)));
            }
            Result = TString.DecodeUTF8(TString,LFetch);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[25],[Offset$24, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// procedure TBinaryData.SetBit(const bitIndex: Integer; const value: Boolean)
   ///  [line: 314, column: 23, file: System.Memory.Buffer]
   ,SetBit$1:function(Self, bitIndex$1, value) {
      TBinaryData.SetByte(Self,(bitIndex$1>>>3),TBitAccess.Set$3(TBitAccess,(bitIndex$1%8),TBinaryData.GetByte(Self,(bitIndex$1>>>3)),value));
   }
   /// procedure TBinaryData.SetByte(const Index: Integer; const Value: Byte)
   ///  [line: 551, column: 23, file: System.Memory.Buffer]
   ,SetByte:function(Self, Index$3, Value$19) {
      if (TAllocation.GetHandle(Self)) {
         if (TBinaryData.OffsetInRange(Self,Index$3)) {
            Self.FDataView.setUint8(Index$3,Value$19);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Invalid byte index, expected %d..%d, not %d",[0, TAllocation.GetHandle(Self).length-1, Index$3]);
         }
      }
   }
   /// function TBinaryData.ToBase64() : String
   ///  [line: 496, column: 22, file: System.Memory.Buffer]
   ,ToBase64:function(Self) {
      var Result = "";
      var mText = "";
      var mRef$2 = undefined;
      var CHUNK_SIZE = 32768;
      var index$2 = 0;
      var mLength = 0;
      var slice$2;
      if (TAllocation.GetHandle(Self)) {
         mRef$2 = TAllocation.GetHandle(Self);
         mLength = (mRef$2).length;
      while (index$2 < mLength)
      {
        slice$2 = (mRef$2).subarray(index$2, Math.min(index$2 + CHUNK_SIZE, mLength));
        mText += String.fromCharCode.apply(null, slice$2);
        index$2 += CHUNK_SIZE;
      }
      Result = btoa(mText);
      }
      return Result
   }
   /// function TBinaryData.ToBytes() : TByteArray
   ///  [line: 395, column: 22, file: System.Memory.Buffer]
   ,ToBytes:function(Self) {
      var Result = [];
      var x$18 = 0;
      if (TAllocation.GetSize$3(Self)>0) {
         var $temp27;
         for(x$18=0,$temp27=TAllocation.GetSize$3(Self);x$18<$temp27;x$18++) {
            Result.push(TBinaryData.GetByte(Self,x$18));
         }
      } else {
         Result = [];
      }
      return Result
   }
   /// function TBinaryData.ToHexDump(BytesPerRow: Integer; Options: TBufferHexDumpOptions) : String
   ///  [line: 327, column: 22, file: System.Memory.Buffer]
   ,ToHexDump:function(Self, BytesPerRow, Options$2) {
      var Result = "";
      var x$19 = 0;
      var y = 0;
      var mCount = 0;
      var mPad = 0;
      var mDump = [];
      if (TAllocation.GetHandle(Self)) {
         BytesPerRow = TInteger.EnsureRange(BytesPerRow,2,64);
         mCount = 0;
         Result = "";
         var $temp28;
         for(x$19=0,$temp28=TAllocation.GetSize$3(Self);x$19<$temp28;x$19++) {
            mDump.push(TBinaryData.GetByte(Self,x$19));
            if ($SetIn(Options$2,0,0,2)) {
               Result+="$"+IntToHex2(TBinaryData.GetByte(Self,x$19));
            } else {
               Result+=IntToHex2(TBinaryData.GetByte(Self,x$19));
            }
            ++mCount;
            if (mCount>=BytesPerRow) {
               if (mDump.length>0) {
                  Result+=" ";
                  var $temp29;
                  for(y=0,$temp29=mDump.length;y<$temp29;y++) {
                     if (function(v$){return (((v$>="A")&&(v$<="Z"))||((v$>="a")&&(v$<="z"))||((v$>="0")&&(v$<="9"))||(v$==",")||(v$==";")||(v$=="<")||(v$==">")||(v$=="{")||(v$=="}")||(v$=="[")||(v$=="]")||(v$=="-")||(v$=="_")||(v$=="#")||(v$=="$")||(v$=="%")||(v$=="&")||(v$=="\/")||(v$=="(")||(v$==")")||(v$=="!")||(v$=="§")||(v$=="^")||(v$==":")||(v$==",")||(v$=="?"))}(TDatatype.ByteToChar(TDatatype,mDump[y]))) {
                        Result+=TDatatype.ByteToChar(TDatatype,mDump[y]);
                     } else {
                        Result+="_";
                     }
                  }
               }
               mDump.length=0;
               Result+="\r\n";
               mCount = 0;
            } else {
               Result+=" ";
            }
         }
         if ($SetIn(Options$2,1,0,2)&&mCount>0) {
            mPad = BytesPerRow-mCount;
            var $temp30;
            for(x$19=1,$temp30=mPad;x$19<=$temp30;x$19++) {
               Result+="--";
               if ($SetIn(Options$2,0,0,2)) {
                  Result+="-";
               }
               ++mCount;
               if (mCount>=BytesPerRow) {
                  Result+="\r\n";
                  mCount = 0;
               } else {
                  Result+=" ";
               }
            }
         }
      }
      return Result
   }
   /// function TBinaryData.ToNodeBuffer() : JNodeBuffer
   ///  [line: 83, column: 22, file: SmartNJ.Streams]
   ,ToNodeBuffer:function(Self) {
      var Result = null;
      if (TAllocation.a$28(Self)) {
         Result = new Buffer();
      } else {
         Result = new Buffer(TBinaryData.ToTypedArray(Self));
      }
      return Result
   }
   /// function TBinaryData.ToStream() : TStream
   ///  [line: 432, column: 22, file: System.Memory.Buffer]
   ,ToStream:function(Self) {
      var Result = null;
      Result = TMemoryStream.Create$24($New(TMemoryStream));
      try {
         TStream.Write$1(Result,TBinaryData.ToBytes(Self));
         TStream.SetPosition$(Result,0);
      } catch ($e) {
         var e$6 = $W($e);
         TObject.Free(Result);
         Result = null;
         throw $e;
      }
      return Result
   }
   /// function TBinaryData.ToString() : String
   ///  [line: 521, column: 22, file: System.Memory.Buffer]
   ,ToString:function(Self) {
      var Result = "";
      var mRef$3 = undefined;
      var CHUNK_SIZE$1 = 32768;
      if (TAllocation.GetHandle(Self)) {
         mRef$3 = TAllocation.GetHandle(Self);
         var c = [];
    for (var i=0; i < (mRef$3).length; i += CHUNK_SIZE$1) {
      c.push(String.fromCharCode.apply(null, (mRef$3).subarray(i, i + CHUNK_SIZE$1)));
    }
    Result = c.join("");
      }
      return Result
   }
   /// function TBinaryData.ToTypedArray() : TMemoryHandle
   ///  [line: 448, column: 22, file: System.Memory.Buffer]
   ,ToTypedArray:function(Self) {
      var Result = undefined;
      var mLen$3 = 0;
      var mTemp$4 = null;
      Result = null;
      mLen$3 = TAllocation.GetSize$3(Self);
      if (mLen$3>0) {
         mTemp$4 = Self.FDataView.buffer.slice(0,mLen$3);
         Result = new Uint8ClampedArray(mTemp$4);
      }
      return Result
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TMemoryHandle)
   ///  [line: 715, column: 23, file: System.Memory.Buffer]
   ,Write$5:function(Self, Offset$25, Data$17) {
      var mGrowth = 0;
      if (Data$17) {
         if (Data$17.length>0) {
            if (TBinaryData.OffsetInRange(Self,Offset$25)) {
               if (Offset$25+Data$17.length>TAllocation.GetSize$3(Self)-1) {
                  mGrowth = Offset$25+Data$17.length-TAllocation.GetSize$3(Self);
               }
               if (mGrowth>0) {
                  TAllocation.Grow(Self,mGrowth);
               }
               TMarshal.Move$1(TMarshal,Data$17,0,TAllocation.GetHandle(Self),Offset$25,parseInt(TAllocation.GetHandle(Self).length,10));
            } else {
               throw EW3Exception.CreateFmt($New(EBinaryData),"Write typed-handle failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$25]);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Write failed, invalid source handle error");
      }
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TBinaryData)
   ///  [line: 688, column: 23, file: System.Memory.Buffer]
   ,Write$4:function(Self, Offset$26, Data$18) {
      var mGrowth$1 = 0;
      if (Data$18!==null) {
         if (TAllocation.GetSize$3(Data$18)>0) {
            if (TBinaryData.OffsetInRange(Self,Offset$26)) {
               if (Offset$26+TAllocation.GetSize$3(Data$18)>TAllocation.GetSize$3(Self)-1) {
                  mGrowth$1 = Offset$26+TAllocation.GetSize$3(Data$18)-TAllocation.GetSize$3(Self);
               }
               if (mGrowth$1>0) {
                  TAllocation.Grow(Self,mGrowth$1);
               }
               TMarshal.Move$1(TMarshal,TAllocation.GetHandle(Data$18),0,TAllocation.GetHandle(Self),0,TAllocation.GetSize$3(Data$18));
            } else {
               throw EW3Exception.CreateFmt($New(EBinaryData),"Write string failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$26]);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Write failed, invalid source buffer [nil] error");
      }
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TByteArray)
   ///  [line: 668, column: 23, file: System.Memory.Buffer]
   ,Write$3:function(Self, Offset$27, Data$19) {
      var mGrowth$2 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$27)) {
         if (Data$19.length>0) {
            if (Offset$27+Data$19.length>TAllocation.GetSize$3(Self)-1) {
               mGrowth$2 = Offset$27+Data$19.length-TAllocation.GetSize$3(Self);
            }
            if (mGrowth$2>0) {
               TAllocation.Grow(Self,mGrowth$2);
            }
            TAllocation.GetHandle(Self).set(Data$19,Offset$27);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write bytearray failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$27]);
      }
   }
   /// procedure TBinaryData.WriteFloat32(const Offset: Integer; const Data: float32)
   ///  [line: 798, column: 23, file: System.Memory.Buffer]
   ,WriteFloat32:function(Self, Offset$28, Data$20) {
      var mGrowth$3 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$28)) {
         if (Offset$28+TDatatype.SizeOfType(TDatatype,8)>TAllocation.GetSize$3(Self)-1) {
            mGrowth$3 = Offset$28+TDatatype.SizeOfType(TDatatype,8)-TAllocation.GetSize$3(Self);
         }
         if (mGrowth$3>0) {
            TAllocation.Grow(Self,mGrowth$3);
         }
         Self.FDataView.setFloat32(Offset$28,Data$20,a$4);
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write float failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$28]);
      }
   }
   /// procedure TBinaryData.WriteFloat64(const Offset: Integer; const Data: float64)
   ///  [line: 816, column: 23, file: System.Memory.Buffer]
   ,WriteFloat64:function(Self, Offset$29, Data$21) {
      var mGrowth$4 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$29)) {
         if (Offset$29+TDatatype.SizeOfType(TDatatype,9)>TAllocation.GetSize$3(Self)-1) {
            mGrowth$4 = Offset$29+TDatatype.SizeOfType(TDatatype,9)-TAllocation.GetSize$3(Self);
         }
         if (mGrowth$4>0) {
            TAllocation.Grow(Self,mGrowth$4);
         }
         Self.FDataView.setFloat64(Offset$29,Number(Data$21),a$4);
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write float failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$29]);
      }
   }
   ,Destroy:TAllocation.Destroy
   ,HandleAllocated$:function($){return $.ClassType.HandleAllocated($)}
   ,HandleReleased$:function($){return $.ClassType.HandleReleased($)}
};
TBinaryData.$Intf={
   IBinaryDataImport:[TBinaryData.FromBase64]
   ,IBinaryDataWriteAccess:[TBinaryData.AppendBytes,TBinaryData.AppendStr,TBinaryData.AppendMemory,TBinaryData.AppendBuffer,TBinaryData.AppendFloat32,TBinaryData.AppendFloat64,TBinaryData.Write$3,TBinaryData.WriteFloat32,TBinaryData.WriteFloat64,TBinaryData.CopyFrom$2,TBinaryData.CopyFromMemory,TBinaryData.CutBinaryData,TBinaryData.CutStream,TBinaryData.CutTypedArray]
   ,IBinaryDataReadWriteAccess:[TBinaryData.ReadFloat32,TBinaryData.ReadFloat64,TBinaryData.ReadBool,TBinaryData.ReadInt,TBinaryData.ReadStr$1,TBinaryData.ReadBytes,TBinaryData.AppendBytes,TBinaryData.AppendStr,TBinaryData.AppendMemory,TBinaryData.AppendBuffer,TBinaryData.AppendFloat32,TBinaryData.AppendFloat64,TBinaryData.Write$3,TBinaryData.WriteFloat32,TBinaryData.WriteFloat64,TBinaryData.CopyFrom$2,TBinaryData.CopyFromMemory,TBinaryData.CutBinaryData,TBinaryData.CutStream,TBinaryData.CutTypedArray]
   ,IBinaryDataBitAccess:[TBinaryData.GetBitCount,TBinaryData.GetBit$1,TBinaryData.SetBit$1]
   ,IBinaryDataExport:[TBinaryData.ToBase64,TBinaryData.ToString,TBinaryData.ToTypedArray,TBinaryData.ToBytes,TBinaryData.ToHexDump,TBinaryData.ToStream,TBinaryData.Clone]
   ,IBinaryDataReadAccess:[TBinaryData.ReadFloat32,TBinaryData.ReadFloat64,TBinaryData.ReadBool,TBinaryData.ReadInt,TBinaryData.ReadStr$1,TBinaryData.ReadBytes]
   ,IBinaryTransport:[TAllocation.DataOffset$1,TAllocation.DataGetSize$1,TAllocation.DataRead$1,TAllocation.DataWrite$1]
   ,IAllocation:[TAllocation.GetHandle,TAllocation.GetTotalSize$1,TAllocation.GetSize$3,TAllocation.GetTransport,TAllocation.Allocate$1,TAllocation.Grow,TAllocation.Shrink,TAllocation.ReAllocate,TAllocation.Transport,TAllocation.Release$2]
}
/// EBinaryData = class (EW3Exception)
///  [line: 125, column: 3, file: System.Memory.Buffer]
var EBinaryData = {
   $ClassName:"EBinaryData",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TBitAccess = class (TObject)
///  [line: 20, column: 3, file: System.Types.Bits]
var TBitAccess = {
   $ClassName:"TBitAccess",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TBitAccess.Get(const index: Integer; const Value: Byte) : Boolean
   ///  [line: 114, column: 27, file: System.Types.Bits]
   ,Get:function(Self, index$3, Value$20) {
      var Result = false;
      var mMask = 0;
      if (index$3>=0&&index$3<8) {
         mMask = 1<<index$3;
         Result = ((Value$20&mMask)!=0);
      } else {
         throw EW3Exception.CreateFmt($New(EW3Exception),"Invalid bit index, expected 0..7 not %d",[index$3]);
      }
      return Result
   }
   /// function TBitAccess.Set(const Index: Integer; const Value: Byte; const Data: Boolean) : Byte
   ///  [line: 127, column: 27, file: System.Types.Bits]
   ,Set$3:function(Self, Index$4, Value$21, Data$22) {
      var Result = 0;
      var mSet = false;
      var mMask$1 = 0;
      Result = Value$21;
      if (Index$4>=0&&Index$4<8) {
         mMask$1 = 1<<Index$4;
         mSet = ((Value$21&mMask$1)!=0);
         if (mSet!=Data$22) {
            if (Data$22) {
               Result = Result|mMask$1;
            } else {
               Result = (Result&(~mMask$1));
            }
         }
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var CNT_BitBuffer_ByteTable = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8];
/// TW3StorageObjectType enumeration
///  [line: 37, column: 3, file: System.Device.Storage]
var TW3StorageObjectType = [ "otUnknown", "otFile", "otFolder", "otBlockDevice", "otCharacterDevice", "otSymbolicLink", "otFIFO", "otSocket" ];
/// TW3StorageDevice = class (TW3Component)
///  [line: 96, column: 3, file: System.Device.Storage]
var TW3StorageDevice = {
   $ClassName:"TW3StorageDevice",$Parent:TW3Component
   ,$Init:function ($) {
      TW3Component.$Init($);
      $.FActive$1 = false;
      $.FIdentifier = $.FName = "";
      $.FOptions$5 = [0];
   }
   /// procedure TW3StorageDevice.FinalizeObject()
   ///  [line: 162, column: 28, file: System.Device.Storage]
   ,FinalizeObject:function(Self) {
      if (Self.FActive$1) {
         TW3StorageDevice.UnMount$(Self,null);
      }
      TW3CustomComponent.FinalizeObject(Self);
   }
   /// function TW3StorageDevice.GetActive() : Boolean
   ///  [line: 254, column: 27, file: System.Device.Storage]
   ,GetActive:function(Self) {
      return Self.FActive$1;
   }
   /// procedure TW3StorageDevice.InitializeObject()
   ///  [line: 154, column: 28, file: System.Device.Storage]
   ,InitializeObject:function(Self) {
      TW3CustomComponent.InitializeObject(Self);
      Self.FOptions$5 = [2];
      Self.FIdentifier = TDatatype.CreateGUID(TDatatype);
      Self.FName = "dh0";
   }
   /// procedure TW3StorageDevice.SetActive(const NewActiveState: Boolean)
   ///  [line: 259, column: 28, file: System.Device.Storage]
   ,SetActive$1:function(Self, NewActiveState) {
      Self.FActive$1 = NewActiveState;
   }
   ,Destroy:TW3CustomComponent.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13:TW3CustomComponent.Create$13
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,CdUp$:function($){return $.ClassType.CdUp.apply($.ClassType, arguments)}
   ,ChDir$:function($){return $.ClassType.ChDir.apply($.ClassType, arguments)}
   ,DirExists$:function($){return $.ClassType.DirExists.apply($.ClassType, arguments)}
   ,Examine$1$:function($){return $.ClassType.Examine$1.apply($.ClassType, arguments)}
   ,FileExists$1$:function($){return $.ClassType.FileExists$1.apply($.ClassType, arguments)}
   ,GetFileSize$:function($){return $.ClassType.GetFileSize.apply($.ClassType, arguments)}
   ,GetPath$1$:function($){return $.ClassType.GetPath$1.apply($.ClassType, arguments)}
   ,GetStorageObjectType$:function($){return $.ClassType.GetStorageObjectType.apply($.ClassType, arguments)}
   ,Load$:function($){return $.ClassType.Load.apply($.ClassType, arguments)}
   ,MakeDir$:function($){return $.ClassType.MakeDir.apply($.ClassType, arguments)}
   ,Mount$:function($){return $.ClassType.Mount.apply($.ClassType, arguments)}
   ,RemoveDir$:function($){return $.ClassType.RemoveDir.apply($.ClassType, arguments)}
   ,Save$:function($){return $.ClassType.Save.apply($.ClassType, arguments)}
   ,UnMount$:function($){return $.ClassType.UnMount.apply($.ClassType, arguments)}
};
TW3StorageDevice.$Intf={
   IW3LockObject:[TW3OwnedLockedErrorObject.DisableAlteration$2,TW3OwnedLockedErrorObject.EnableAlteration$2,TW3OwnedLockedErrorObject.GetLockState$2]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TW3DeviceAuthenticationData = class (TObject)
///  [line: 49, column: 3, file: System.Device.Storage]
var TW3DeviceAuthenticationData = {
   $ClassName:"TW3DeviceAuthenticationData",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TApplication = class (TObject)
///  [line: 29, column: 3, file: SmartNJ.Application]
var TApplication = {
   $ClassName:"TApplication",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TJSONObject = class (TObject)
///  [line: 36, column: 3, file: System.JSON]
var TJSONObject = {
   $ClassName:"TJSONObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FInstance = undefined;
      $.FOptions$6 = [0];
   }
   /// function TJSONObject.AddOrSet(const PropertyName: String; const Data: Variant) : TJSONObject
   ///  [line: 403, column: 22, file: System.JSON]
   ,AddOrSet:function(Self, PropertyName, Data$23) {
      var Result = null;
      Result = Self;
      if (TJSONObject.Exists$1(Self,PropertyName)) {
         if ($SetIn(Self.FOptions$6,3,0,4)) {
            Self.FInstance[PropertyName] = Data$23;
         } else {
            throw EW3Exception.CreateFmt($New(EJSONObject),"Failed to set value[%s], instance does not allow alteration",[PropertyName]);
         }
      } else if ($SetIn(Self.FOptions$6,1,0,4)) {
         Self.FInstance[PropertyName] = Data$23;
      } else {
         throw EW3Exception.CreateFmt($New(EJSONObject),"Failed to add value [%s], instance does not allow new properties",[PropertyName]);
      }
      return Result
   }
   /// procedure TJSONObject.Clear()
   ///  [line: 334, column: 23, file: System.JSON]
   ,Clear$1:function(Self) {
      Self.FInstance = TVariant.CreateObject();
   }
   /// constructor TJSONObject.Create(const Instance: TJsInstance; const Options: TJSONObjectOptions; Clone: Boolean)
   ///  [line: 176, column: 25, file: System.JSON]
   ,Create$59:function(Self, Instance$4, Options$3, Clone$1) {
      TObject.Create(Self);
      Self.FOptions$6 = Options$3.slice(0);
      if (TW3VariantHelper$Valid$2(Instance$4)) {
         if (TW3VariantHelper$IsObject(Instance$4)) {
            if (Clone$1) {
               Self.FInstance = TVariant.CreateObject();
               TVariant.ForEachProperty(Instance$4,function (Name$4, Data$24) {
                  var Result = 1;
                  TJSONObject.AddOrSet(Self,Name$4,Data$24);
                  Result = 1;
                  return Result
               });
            } else {
               Self.FInstance = Instance$4;
            }
         } else {
            throw Exception.Create($New(EJSONObject),"Failed to clone instance, reference is not an object");
         }
      } else {
         if ($SetIn(Self.FOptions$6,0,0,4)) {
            Self.FInstance = TVariant.CreateObject();
         } else {
            throw Exception.Create($New(EJSONObject),"Instance was nil, provided options does not allow initialization error");
         }
      }
      return Self
   }
   /// constructor TJSONObject.Create(const Instance: TJsInstance; const Options: TJSONObjectOptions)
   ///  [line: 152, column: 25, file: System.JSON]
   ,Create$58:function(Self, Instance$5, Options$4) {
      TObject.Create(Self);
      Self.FOptions$6 = Options$4.slice(0);
      if (TW3VariantHelper$Valid$2(Instance$5)&&TW3VariantHelper$IsObject(Instance$5)) {
         Self.FInstance = Instance$5;
      } else {
         if ($SetIn(Self.FOptions$6,0,0,4)) {
            Self.FInstance = TVariant.CreateObject();
         } else {
            throw Exception.Create($New(EJSONObject),"Instance was nil, provided options does not allow initialization error");
         }
      }
      return Self
   }
   /// constructor TJSONObject.Create(const Instance: TJsInstance)
   ///  [line: 132, column: 25, file: System.JSON]
   ,Create$57:function(Self, Instance$6) {
      TObject.Create(Self);
      Self.FOptions$6 = [15];
      if (TW3VariantHelper$Valid$2(Instance$6)) {
         if (TW3VariantHelper$IsObject(Instance$6)) {
            Self.FInstance = Instance$6;
         } else {
            throw Exception.Create($New(EJSONObject),"Failed to inspect instance, reference is not an object");
         }
      } else {
         Self.FInstance = TVariant.CreateObject();
      }
      return Self
   }
   /// constructor TJSONObject.Create()
   ///  [line: 125, column: 25, file: System.JSON]
   ,Create$56:function(Self) {
      TObject.Create(Self);
      Self.FOptions$6 = [15];
      Self.FInstance = TVariant.CreateObject();
      return Self
   }
   /// destructor TJSONObject.Destroy()
   ,Destroy$14:function(Self) {
      Self.FInstance = null;
      TObject.Destroy(Self);
   }
   /// function TJSONObject.Exists(const PropertyName: String) : Boolean
   ///  [line: 422, column: 22, file: System.JSON]
   ,Exists$1:function(Self, PropertyName$1) {
      return (Object.hasOwnProperty.call(Self.FInstance,PropertyName$1)?true:false);
   }
   /// procedure TJSONObject.FromJSON(const Text: String)
   ///  [line: 300, column: 23, file: System.JSON]
   ,FromJSON:function(Self, Text$4) {
      Self.FInstance = JSON.parse(Text$4);
   }
   /// procedure TJSONObject.LoadFromStream(const Stream: TStream)
   ///  [line: 317, column: 23, file: System.JSON]
   ,LoadFromStream$1:function(Self, Stream$2) {
      var LReader = null;
      LReader = TW3CustomReader.Create$29($New(TReader),$AsIntf(Stream$2,"IBinaryTransport"));
      try {
         Self.FInstance = JSON.parse(TString.DecodeBase64(TString,TW3CustomReader.ReadString$1(LReader)));
      } finally {
         TObject.Free(LReader);
      }
   }
   /// function TJSONObject.Read(const PropertyName: String; var Data: Variant) : TJSONObject
   ///  [line: 379, column: 22, file: System.JSON]
   ,Read$3:function(Self, PropertyName$2, Data$25) {
      var Result = null;
      Result = Self;
      if (TJSONObject.Exists$1(Self,PropertyName$2)) {
         Data$25.v = Self.FInstance[PropertyName$2];
      } else {
         throw EW3Exception.CreateFmt($New(EJSONObject),"Failed to read value, property [%s] not found error",[PropertyName$2]);
      }
      return Result
   }
   /// procedure TJSONObject.SaveToStream(const Stream: TStream)
   ///  [line: 305, column: 23, file: System.JSON]
   ,SaveToStream$1:function(Self, Stream$3) {
      var LWriter = null;
      LWriter = TW3CustomWriter.Create$4($New(TWriter),$AsIntf(Stream$3,"IBinaryTransport"));
      try {
         TW3CustomWriter.WriteString(LWriter,TString.EncodeBase64(TString,JSON.stringify(Self.FInstance)));
      } finally {
         TObject.Free(LWriter);
      }
   }
   /// function TJSONObject.ToJSON() : String
   ///  [line: 295, column: 22, file: System.JSON]
   ,ToJSON:function(Self) {
      return JSON.stringify(Self.FInstance);
   }
   /// function TJSONObject.ToString() : String
   ///  [line: 290, column: 22, file: System.JSON]
   ,ToString$1:function(Self) {
      return JSON.stringify(Self.FInstance);
   }
   ,Destroy:TObject.Destroy
};
/// EJSONObject = class (EW3Exception)
///  [line: 34, column: 3, file: System.JSON]
var EJSONObject = {
   $ClassName:"EJSONObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3NodeStorageDevice = class (TW3StorageDevice)
///  [line: 62, column: 3, file: SmartNJ.Device.Storage]
var TW3NodeStorageDevice = {
   $ClassName:"TW3NodeStorageDevice",$Parent:TW3StorageDevice
   ,$Init:function ($) {
      TW3StorageDevice.$Init($);
      $.FCurrent$1 = $.FRootPath = "";
      $.FFileSys = null;
   }
   /// procedure TW3NodeStorageDevice.CdUp(CB: TW3DeviceCdUpCallback)
   ///  [line: 676, column: 32, file: SmartNJ.Device.Storage]
   ,CdUp:function(Self, CB) {
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         TW3StorageDevice.GetPath$1$(Self,function (Sender$2, Path, Success$1) {
            var xCurrentPath = "",
               DirParser = null,
               Moniker = "",
               Separator$18 = "",
               Parts$2 = [];
            if (Success$1) {
               xCurrentPath = Path;
               DirParser = GetDirectoryParser();
               Moniker = DirParser[1]();
               Separator$18 = DirParser[0]();
               xCurrentPath = TW3NodeStorageDevice.Normalize(Self,xCurrentPath);
               if ((xCurrentPath).toLocaleLowerCase()==(Moniker).toLocaleLowerCase()) {
                  if (CB) {
                     CB(Self,false);
                  }
                  return;
               }
               if (StrEndsWith(xCurrentPath,Separator$18)) {
                  xCurrentPath = (xCurrentPath).substr(0,(xCurrentPath.length-1));
               }
               Parts$2 = (xCurrentPath).split(Separator$18);
               Parts$2.splice((Parts$2.length-1),1)
               ;
               xCurrentPath = (Parts$2).join(Separator$18);
               TW3StorageDevice.ChDir$(Self,xCurrentPath,function (Sender$3, Path$1, Success$2) {
                  if (CB) {
                     CB(Self,Success$2);
                  }
               });
            } else if (CB) {
               CB(Self,false);
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.CdUp"]);
         if (CB) {
            CB(Self,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.ChDir(FolderPath: String; CB: TW3DeviceChDirCallback)
   ///  [line: 376, column: 32, file: SmartNJ.Device.Storage]
   ,ChDir:function(Self, FolderPath, CB$1) {
      var Access$4 = null,
         workingpath = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         FolderPath = TW3NodeStorageDevice.Normalize(Self,FolderPath);
         Access$4 = process;
         if (Access$4!==null) {
            workingpath = "";
            try {
               Access$4.chdir(FolderPath);
               workingpath = Access$4.cwd();
            } catch ($e) {
               var e$7 = $W($e);
               TW3OwnedErrorObject.SetLastError$1(Self,e$7.FMessage);
               if (CB$1) {
                  CB$1(Self,FolderPath,false);
               }
               return;
            }
            Self.FCurrent$1 = workingpath;
            if (CB$1) {
               CB$1(Self,workingpath,workingpath.length>0);
            }
         } else {
            TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, unable to access process error",["TW3NodeStorageDevice.ChDir"]);
            if (CB$1) {
               CB$1(Self,FolderPath,false);
            }
         }
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.ChDir"]);
         if (CB$1) {
            CB$1(Self,FolderPath,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.DirExists(FolderName: String; CB: TW3DeviceGetFileExistsCallback)
   ///  [line: 534, column: 32, file: SmartNJ.Device.Storage]
   ,DirExists:function(Self, FolderName$2, CB$2) {
      var PROCNAME = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME = "TW3NodeStorageDevice.DirExists";
         FolderName$2 = TW3NodeStorageDevice.Normalize(Self,FolderName$2);
         Self.FFileSys.lstat(FolderName$2,function (err, stats) {
            if (err) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed with message %s",[PROCNAME, err.message]);
               if (CB$2) {
                  CB$2(Self,FolderName$2,false);
               }
               return;
            }
            if (CB$2) {
               CB$2(Self,FolderName$2,stats.isDirectory());
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.DirExists"]);
         if (CB$2) {
            CB$2(Self,FolderName$2,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.Examine(FolderPath: String; CB: TW3FileOperationExamineCallBack)
   ///  [line: 643, column: 32, file: SmartNJ.Device.Storage]
   ,Examine$1:function(Self, FolderPath$1, CB$3) {
      var PROCNAME$1 = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$1 = "TW3NodeStorageDevice.Examine";
         FolderPath$1 = TW3NodeStorageDevice.Normalize(Self,FolderPath$1);
         Self.FFileSys.readdir(FolderPath$1,function (err$1, files) {
            if (err$1) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed with message: %s",[PROCNAME$1, err$1.message]);
               if (CB$3) {
                  CB$3(Self,FolderPath$1,[],false);
               }
            } else if (CB$3) {
               CB$3(Self,FolderPath$1,files,true);
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.Examine"]);
         if (CB$3) {
            CB$3(Self,FolderPath$1,[],false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.FileExists(Filename: String; CB: TW3DeviceGetFileExistsCallback)
   ///  [line: 427, column: 32, file: SmartNJ.Device.Storage]
   ,FileExists$1:function(Self, Filename$5, CB$4) {
      var PROCNAME$2 = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$2 = "TW3NodeStorageDevice.FileExists";
         Filename$5 = TW3NodeStorageDevice.Normalize(Self,Filename$5);
         Self.FFileSys.exists(Filename$5,function (exists$1) {
            if (exists$1) {
               Self.FFileSys.lstat(Filename$5,function (err$2, stats$1) {
                  if (err$2) {
                     TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed with message %s",[PROCNAME$2, err$2.message]);
                     if (CB$4) {
                        CB$4(Self,Filename$5,false);
                     }
                     return;
                  }
                  if (CB$4) {
                     CB$4(Self,Filename$5,stats$1.isFile());
                  }
               });
            } else if (CB$4) {
               CB$4(Self,Filename$5,false);
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.FileExists"]);
         if (CB$4) {
            CB$4(Self,"",false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.GetFileSize(Filename: String; CB: TW3DeviceGetFileSizeCallback)
   ///  [line: 306, column: 32, file: SmartNJ.Device.Storage]
   ,GetFileSize:function(Self, Filename$6, CB$5) {
      var PROCNAME$3 = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$3 = "TW3NodeStorageDevice.GetFileSize";
         Filename$6 = TW3NodeStorageDevice.Normalize(Self,Filename$6);
         Self.FFileSys.lstat(Filename$6,function (err$3, stats$2) {
            if (err$3) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed with message %s",[PROCNAME$3, err$3.message]);
               if (CB$5) {
                  CB$5(Self,Filename$6,0,false);
               }
               return;
            }
            if (CB$5) {
               CB$5(Self,Filename$6,stats$2.size,true);
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.GetFileSize"]);
         if (CB$5) {
            CB$5(Self,"",0,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.GetPath(CB: TW3DeviceGetPathCallback)
   ///  [line: 343, column: 32, file: SmartNJ.Device.Storage]
   ,GetPath$1:function(Self, CB$6) {
      var Access$5 = null;
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         try {
            Access$5 = process;
            if (Access$5!==null) {
               if (CB$6) {
                  CB$6(Self,Access$5.cwd(),true);
               }
            }
         } catch ($e) {
            var e$8 = $W($e);
            TW3OwnedErrorObject.SetLastError$1(Self,e$8.FMessage);
            CB$6(Self,"",false);
            return;
         }
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.GetPath"]);
         if (CB$6) {
            CB$6(Self,"",false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.GetStorageObjectType(ObjName: String; CB: TW3DeviceObjTypeCallback)
   ///  [line: 474, column: 32, file: SmartNJ.Device.Storage]
   ,GetStorageObjectType:function(Self, ObjName, CB$7) {
      var PROCNAME$4 = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$4 = "TW3NodeStorageDevice.GetStorageObjectType";
         ObjName = TW3NodeStorageDevice.Normalize(Self,ObjName);
         Self.FFileSys.lstat(ObjName,function (err$4, stats$3) {
            if (err$4) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed with message %s",[PROCNAME$4, err$4.message]);
               if (CB$7) {
                  CB$7(Self,ObjName,0,false);
               }
               return;
            }
            if (CB$7) {
               if (stats$3.isDirectory()) {
                  CB$7(Self,ObjName,2,true);
               } else if (stats$3.isFile()) {
                  CB$7(Self,ObjName,1,true);
               } else if (stats$3.isBlockDevice()) {
                  CB$7(Self,ObjName,3,true);
               } else if (stats$3.isCharacterDevice()) {
                  CB$7(Self,ObjName,4,true);
               } else if (stats$3.isSymbolicLink()) {
                  CB$7(Self,ObjName,5,true);
               } else if (stats$3.isFIFO()) {
                  CB$7(Self,ObjName,6,true);
               } else if (stats$3.isSocket()) {
                  CB$7(Self,ObjName,7,true);
               } else {
                  CB$7(Self,ObjName,0,false);
               }
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.GetStorageObjectType"]);
         if (CB$7) {
            CB$7(Self,ObjName,0,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.Load(Filename: String; CB: TW3DeviceLoadCallback)
   ///  [line: 737, column: 32, file: SmartNJ.Device.Storage]
   ,Load:function(Self, Filename$7, CB$8) {
      var PROCNAME$5 = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$5 = "TW3NodeStorageDevice.Load";
         Filename$7 = TW3NodeStorageDevice.Normalize(Self,Filename$7);
         Self.FFileSys.readFile(Filename$7,function (err$5, data$2) {
            var SmartBuffer = null,
               DataStream = null;
            if (err$5) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed: %s",[PROCNAME$5, err$5.message]);
               if (CB$8) {
                  CB$8(Self,Filename$7,null,false);
               }
               return;
            }
            if (CB$8) {
               SmartBuffer = TAllocation.Create$27($New(TBinaryData));
               try {
                  TBinaryData.FromNodeBuffer(SmartBuffer,data$2);
                  DataStream = TBinaryData.ToStream(SmartBuffer);
                  CB$8(Self,Filename$7,DataStream,true);
               } finally {
                  TObject.Free(SmartBuffer);
               }
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.Load"]);
         if (CB$8) {
            CB$8(Self,Filename$7,null,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.MakeDir(FolderName: String; Mode: TW3FilePermissionMask; CB: TW3DeviceMakeDirCallback)
   ///  [line: 572, column: 32, file: SmartNJ.Device.Storage]
   ,MakeDir:function(Self, FolderName$3, Mode, CB$9) {
      var PROCNAME$6 = "",
         ModeStr = "";
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$6 = "TW3NodeStorageDevice.MakeDir";
         FolderName$3 = TW3NodeStorageDevice.Normalize(Self,FolderName$3);
         ModeStr = Mode.toString();
         Self.FFileSys.mkdir(FolderName$3,ModeStr,function (err$6) {
            if (err$6) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed with message: %s",[PROCNAME$6, err$6.message]);
               if (CB$9) {
                  CB$9(Self,FolderName$3,false);
               }
            } else if (CB$9) {
               CB$9(Self,FolderName$3,true);
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.MakeDir"]);
         if (CB$9) {
            CB$9(Self,FolderName$3,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.Mount(Authentication: TW3DeviceAuthenticationData; CB: TW3StorageDeviceMountEvent)
   ///  [line: 246, column: 32, file: SmartNJ.Device.Storage]
   ,Mount:function(Self, Authentication, CB$10) {
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         TW3StorageDevice.UnMount$(Self,null);
      }
      Self.FFileSys = NodeFsAPI();
      try {
         Self.FRootPath = process.cwd();
      } catch ($e) {
         var e$9 = $W($e);
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.Mount"]);
         if (CB$10) {
            CB$10(Self,false);
         }
         return;
      }
      Self.FCurrent$1 = Self.FRootPath;
      TW3StorageDevice.SetActive$1(Self,true);
      if (CB$10) {
         CB$10(Self,true);
      }
   }
   /// function TW3NodeStorageDevice.Normalize(NameOrPath: String) : String
   ///  [line: 301, column: 31, file: SmartNJ.Device.Storage]
   ,Normalize:function(Self, NameOrPath) {
      return NodePathAPI().normalize(NameOrPath);
   }
   /// procedure TW3NodeStorageDevice.RemoveDir(FolderName: String; CB: TW3DeviceRemoveDirCallback)
   ///  [line: 609, column: 32, file: SmartNJ.Device.Storage]
   ,RemoveDir:function(Self, FolderName$4, CB$11) {
      /* null */
   }
   /// procedure TW3NodeStorageDevice.Save(Filename: String; Data: TStream; CB: TW3DeviceSaveCallback)
   ///  [line: 786, column: 32, file: SmartNJ.Device.Storage]
   ,Save:function(Self, Filename$8, Data$26, CB$12) {
      var PROCNAME$7 = "",
         buffer$2 = null;
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         PROCNAME$7 = "TW3NodeStorageDevice.Save";
         Filename$8 = TW3NodeStorageDevice.Normalize(Self,Filename$8);
         TStream.SetPosition$(Data$26,0);
         buffer$2 = Buffer.from(TStream.Read(Data$26,TStream.GetSize$1$(Data$26)));
         Self.FFileSys.writeFile(Filename$8,buffer$2,function (err$7) {
            if (err$7) {
               TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed: %s",[PROCNAME$7, err$7.message]);
               if (CB$12) {
                  CB$12(Self,Filename$8,false);
               }
               return;
            }
            if (CB$12) {
               CB$12(Self,Filename$8,true);
            }
         });
      } else {
         TW3OwnedErrorObject.SetLastErrorF$1(Self,"%s failed, device not active error",["TW3NodeStorageDevice.Save"]);
         if (CB$12) {
            CB$12(Self,Filename$8,false);
         }
      }
   }
   /// procedure TW3NodeStorageDevice.UnMount(CB: TW3StorageDeviceUnMountEvent)
   ///  [line: 282, column: 32, file: SmartNJ.Device.Storage]
   ,UnMount:function(Self, CB$13) {
      if (TW3OwnedErrorObject.GetFailed$1(Self)) {
         TW3OwnedErrorObject.ClearLastError$1(Self);
      }
      if (TW3StorageDevice.GetActive(Self)) {
         try {
            TW3StorageDevice.SetActive$1(Self,false);
            if (CB$13) {
               CB$13(Self,true);
            }
         } finally {
            Self.FFileSys = null;
            Self.FRootPath = "";
            Self.FCurrent$1 = "";
         }
      }
   }
   ,Destroy:TW3CustomComponent.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$13:TW3CustomComponent.Create$13
   ,FinalizeObject:TW3StorageDevice.FinalizeObject
   ,InitializeObject:TW3StorageDevice.InitializeObject
   ,CdUp$:function($){return $.ClassType.CdUp.apply($.ClassType, arguments)}
   ,ChDir$:function($){return $.ClassType.ChDir.apply($.ClassType, arguments)}
   ,DirExists$:function($){return $.ClassType.DirExists.apply($.ClassType, arguments)}
   ,Examine$1$:function($){return $.ClassType.Examine$1.apply($.ClassType, arguments)}
   ,FileExists$1$:function($){return $.ClassType.FileExists$1.apply($.ClassType, arguments)}
   ,GetFileSize$:function($){return $.ClassType.GetFileSize.apply($.ClassType, arguments)}
   ,GetPath$1$:function($){return $.ClassType.GetPath$1.apply($.ClassType, arguments)}
   ,GetStorageObjectType$:function($){return $.ClassType.GetStorageObjectType.apply($.ClassType, arguments)}
   ,Load$:function($){return $.ClassType.Load.apply($.ClassType, arguments)}
   ,MakeDir$:function($){return $.ClassType.MakeDir.apply($.ClassType, arguments)}
   ,Mount$:function($){return $.ClassType.Mount.apply($.ClassType, arguments)}
   ,RemoveDir$:function($){return $.ClassType.RemoveDir.apply($.ClassType, arguments)}
   ,Save$:function($){return $.ClassType.Save.apply($.ClassType, arguments)}
   ,UnMount$:function($){return $.ClassType.UnMount.apply($.ClassType, arguments)}
};
TW3NodeStorageDevice.$Intf={
   IW3LockObject:[TW3OwnedLockedErrorObject.DisableAlteration$2,TW3OwnedLockedErrorObject.EnableAlteration$2,TW3OwnedLockedErrorObject.GetLockState$2]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
}
/// TWriteFileOptions = record
///  [line: 71, column: 3, file: NodeJS.fs]
function Copy$TWriteFileOptions(s,d) {
   return d;
}
function Clone$TWriteFileOptions($) {
   return {

   }
}
/// TWatchOptions = record
///  [line: 93, column: 3, file: NodeJS.fs]
function Copy$TWatchOptions(s,d) {
   return d;
}
function Clone$TWatchOptions($) {
   return {

   }
}
/// TWatchFileOptions = record
///  [line: 88, column: 3, file: NodeJS.fs]
function Copy$TWatchFileOptions(s,d) {
   return d;
}
function Clone$TWatchFileOptions($) {
   return {

   }
}
/// TWatchFileListenerObject = record
///  [line: 83, column: 3, file: NodeJS.fs]
function Copy$TWatchFileListenerObject(s,d) {
   return d;
}
function Clone$TWatchFileListenerObject($) {
   return {

   }
}
/// TReadFileSyncOptions = record
///  [line: 66, column: 3, file: NodeJS.fs]
function Copy$TReadFileSyncOptions(s,d) {
   return d;
}
function Clone$TReadFileSyncOptions($) {
   return {

   }
}
/// TReadFileOptions = record
///  [line: 61, column: 3, file: NodeJS.fs]
function Copy$TReadFileOptions(s,d) {
   return d;
}
function Clone$TReadFileOptions($) {
   return {

   }
}
/// TCreateWriteStreamOptions = class (TObject)
///  [line: 122, column: 3, file: NodeJS.fs]
var TCreateWriteStreamOptions = {
   $ClassName:"TCreateWriteStreamOptions",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TCreateWriteStreamOptionsEx = class (TCreateWriteStreamOptions)
///  [line: 131, column: 3, file: NodeJS.fs]
var TCreateWriteStreamOptionsEx = {
   $ClassName:"TCreateWriteStreamOptionsEx",$Parent:TCreateWriteStreamOptions
   ,$Init:function ($) {
      TCreateWriteStreamOptions.$Init($);
      $.start = 0;
   }
   ,Destroy:TObject.Destroy
};
/// TCreateReadStreamOptions = class (TObject)
///  [line: 102, column: 3, file: NodeJS.fs]
var TCreateReadStreamOptions = {
   $ClassName:"TCreateReadStreamOptions",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TCreateReadStreamOptionsEx = class (TCreateReadStreamOptions)
///  [line: 112, column: 3, file: NodeJS.fs]
var TCreateReadStreamOptionsEx = {
   $ClassName:"TCreateReadStreamOptionsEx",$Parent:TCreateReadStreamOptions
   ,$Init:function ($) {
      TCreateReadStreamOptions.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TAppendFileOptions = record
///  [line: 77, column: 3, file: NodeJS.fs]
function Copy$TAppendFileOptions(s,d) {
   return d;
}
function Clone$TAppendFileOptions($) {
   return {

   }
}
function NodeFsAPI() {
   return require("fs");
};
function NodePathAPI() {
   return require("path");
};
/// JPathParseData = record
///  [line: 20, column: 3, file: NodeJS.Path]
function Copy$JPathParseData(s,d) {
   return d;
}
function Clone$JPathParseData($) {
   return {

   }
}
/// TNJFileWalker = class (TW3ErrorObject)
///  [line: 47, column: 3, file: SmartNJ.FileWalker]
var TNJFileWalker = {
   $ClassName:"TNJFileWalker",$Parent:TW3ErrorObject
   ,$Init:function ($) {
      TW3ErrorObject.$Init($);
      $.OnIncludeFile = null;
      $.OnAfterWalk = null;
      $.FBusy = $.FCancel = false;
      $.FCurrent$2 = $.FPath = "";
      $.FDelay$2 = 0;
      $.FFilesystem = $.FFinished = $.FListData = null;
      $.FItemStack = [];
   }
   /// procedure TNJFileWalker.Cancel()
   ///  [line: 159, column: 25, file: SmartNJ.FileWalker]
   ,Cancel:function(Self) {
      if (Self.FBusy) {
         Self.FCancel = true;
         Self.FItemStack.length=0;
      }
   }
   /// constructor TNJFileWalker.Create(FileSystem: TW3StorageDevice)
   ///  [line: 112, column: 27, file: SmartNJ.FileWalker]
   ,Create$62:function(Self, FileSystem) {
      TW3ErrorObject.Create$31(Self);
      if (FileSystem===null) {
         throw Exception.Create($New(ENJFileWalker),$R[23]);
      }
      if (!TW3StorageDevice.GetActive(FileSystem)) {
         throw Exception.Create($New(ENJFileWalker),$R[24]);
      }
      Self.FFilesystem = FileSystem;
      Self.FListData = new TNJFileItemList();
      Self.FDelay$2 = 20;
      return Self
   }
   /// destructor TNJFileWalker.Destroy()
   ///  [line: 127, column: 26, file: SmartNJ.FileWalker]
   ,Destroy:function(Self) {
      try {
         try {
            if (Self.FBusy) {
               TNJFileWalker.Cancel(Self);
            }
         } finally {
            Self.FItemStack.length=0;
            Self.FListData.dlPath = "";
            Self.FListData.dlItems.length=0;
            Self.FListData = null;
            Self.FFinished = null;
         }
      } catch ($e) {
         var e$10 = $W($e);
         /* null */
      }
      TW3ErrorObject.Destroy(Self);
   }
   /// procedure TNJFileWalker.DoAfterWalk()
   ///  [line: 197, column: 25, file: SmartNJ.FileWalker]
   ,DoAfterWalk:function(Self) {
      try {
         if (Self.FFinished) {
            Self.FFinished(Self,true);
         }
      } finally {
         if (Self.OnAfterWalk) {
            Self.OnAfterWalk(Self);
         }
      }
   }
   /// procedure TNJFileWalker.NextOrDone()
   ///  [line: 222, column: 25, file: SmartNJ.FileWalker]
   ,NextOrDone:function(Self) {
      function SignalDone() {
         Self.FBusy = false;
         TW3Dispatch.Execute(TW3Dispatch,$Event0(Self,TNJFileWalker.DoAfterWalk),Self.FDelay$2);
      };
      if (Self.FCancel) {
         SignalDone();
         return;
      }
      if (Self.FItemStack.length>0) {
         TW3Dispatch.Execute(TW3Dispatch,$Event0(Self,TNJFileWalker.ProcessFromStack),Self.FDelay$2);
      } else {
         SignalDone();
      }
   }
   /// procedure TNJFileWalker.ProcessFromStack()
   ///  [line: 246, column: 25, file: SmartNJ.FileWalker]
   ,ProcessFromStack:function(Self) {
      var LKeep = {v:false},
         FileObjName = "";
      if (Self.FOptions$3.AutoResetError) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (Self.FCancel) {
         TNJFileWalker.NextOrDone(Self);
         return;
      }
      if (Self.FItemStack.length>0) {
         LKeep.v = true;
         FileObjName = Self.FItemStack.pop();
         Self.FCurrent$2 = NodePathAPI().normalize(IncludeTrailingPathDelimiter$4(Self.FPath)+FileObjName);
         NodeFsAPI().stat(Self.FCurrent$2,function (err$8, stats$4) {
            var LItem$3 = null,
               LTemp$5 = "";
            if (err$8) {
               TW3ErrorObject.SetLastError(Self,err$8.message);
               TNJFileWalker.NextOrDone(Self);
               return;
            }
            LItem$3 = new TNJFileItem();
            LItem$3.diFileName = FileObjName;
            LItem$3.diFileType = (stats$4.isFile())?0:1;
            LItem$3.diFileSize = (stats$4.isFile())?stats$4.size:0;
            LItem$3.diCreated = (stats$4.ctime!==null)?JDateToDateTime(stats$4.ctime):Now();
            LItem$3.diModified = (stats$4.mtime!==null)?JDateToDateTime(stats$4.mtime):Now();
            if (stats$4.isFile()) {
               LTemp$5 = "";
               LTemp$5 = '0' + ((stats$4).mode & parseInt('777', 8)).toString(8);
               LItem$3.diFileMode = LTemp$5;
            }
            if (Self.OnIncludeFile) {
               Self.OnIncludeFile(Self,LItem$3,LKeep);
            }
            if (LKeep.v) {
               Self.FListData.dlItems.push(LItem$3);
            } else {
               LItem$3 = null;
            }
            Self.FCurrent$2 = "";
            TW3Dispatch.Execute(TW3Dispatch,$Event0(Self,TNJFileWalker.NextOrDone),Self.FDelay$2);
         });
      } else {
         TNJFileWalker.NextOrDone(Self);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
TNJFileWalker.$Intf={
   IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TNJFileItemType enumeration
///  [line: 22, column: 3, file: SmartNJ.FileWalker]
var TNJFileItemType = [ "wtFile", "wtFolder" ];
/// TNJFileItemList = class (JObject)
///  [line: 37, column: 3, file: SmartNJ.FileWalker]
function TNJFileItemList() {
   this.dlItems = [];
}
$Extend(Object,TNJFileItemList,
   {
      "dlPath" : ""
   });

/// TNJFileItem = class (JObject)
///  [line: 27, column: 3, file: SmartNJ.FileWalker]
function TNJFileItem() {
}
$Extend(Object,TNJFileItem,
   {
      "diFileName" : "",
      "diFileType" : 0,
      "diFileSize" : 0,
      "diFileMode" : "",
      "diCreated" : 0,
      "diModified" : 0
   });

/// ENJFileWalker = class (EW3Exception)
///  [line: 17, column: 3, file: SmartNJ.FileWalker]
var ENJFileWalker = {
   $ClassName:"ENJFileWalker",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function NodeJSOsAPI() {
   return require("os");
};
/// Tlisteners_result_object = class (TObject)
///  [line: 36, column: 3, file: NodeJS.cluster]
var Tlisteners_result_object = {
   $ClassName:"Tlisteners_result_object",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
function NodeJSClusterAPI() {
   return require("cluster");
};
/// TNJCustomServer = class (TW3ErrorObject)
///  [line: 57, column: 3, file: SmartNJ.Server]
var TNJCustomServer = {
   $ClassName:"TNJCustomServer",$Parent:TW3ErrorObject
   ,$Init:function ($) {
      TW3ErrorObject.$Init($);
      $.OnBeforeServerStarted = null;
      $.OnAfterServerStopped = null;
      $.OnAfterServerStarted = null;
      $.FActive$2 = false;
      $.FHandle$5 = undefined;
      $.FPort = 0;
   }
   /// procedure TNJCustomServer.AfterStart()
   ///  [line: 164, column: 27, file: SmartNJ.Server]
   ,AfterStart:function(Self) {
      if (Self.OnAfterServerStarted) {
         Self.OnAfterServerStarted(Self);
      }
   }
   /// procedure TNJCustomServer.AfterStop()
   ///  [line: 170, column: 27, file: SmartNJ.Server]
   ,AfterStop:function(Self) {
      if (Self.OnAfterServerStopped) {
         Self.OnAfterServerStopped(Self);
      }
   }
   /// procedure TNJCustomServer.BeforeStart()
   ///  [line: 158, column: 27, file: SmartNJ.Server]
   ,BeforeStart:function(Self) {
      if (Self.OnBeforeServerStarted) {
         Self.OnBeforeServerStarted(Self);
      }
   }
   /// function TNJCustomServer.GetActive() : Boolean
   ///  [line: 192, column: 26, file: SmartNJ.Server]
   ,GetActive$1:function(Self) {
      return Self.FActive$2;
   }
   /// function TNJCustomServer.GetHandle() : THandle
   ///  [line: 202, column: 26, file: SmartNJ.Server]
   ,GetHandle$1:function(Self) {
      return Self.FHandle$5;
   }
   /// function TNJCustomServer.GetPort() : Integer
   ///  [line: 176, column: 26, file: SmartNJ.Server]
   ,GetPort:function(Self) {
      return Self.FPort;
   }
   /// procedure TNJCustomServer.SetActive(const Value: Boolean)
   ///  [line: 197, column: 27, file: SmartNJ.Server]
   ,SetActive$2:function(Self, Value$22) {
      Self.FActive$2 = Value$22;
   }
   /// procedure TNJCustomServer.SetHandle(const Value: THandle)
   ///  [line: 207, column: 27, file: SmartNJ.Server]
   ,SetHandle:function(Self, Value$23) {
      Self.FHandle$5 = Value$23;
   }
   /// procedure TNJCustomServer.SetPort(const Value: Integer)
   ///  [line: 181, column: 27, file: SmartNJ.Server]
   ,SetPort:function(Self, Value$24) {
      if (Self.FOptions$3.AutoResetError) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (TNJCustomServer.GetActive$1(Self)) {
         TW3ErrorObject.SetLastError(Self,"Port cannot be altered while server is active error");
      } else {
         Self.FPort = Value$24;
      }
   }
   /// procedure TNJCustomServer.Start()
   ///  [line: 118, column: 27, file: SmartNJ.Server]
   ,Start:function(Self) {
      if (Self.FOptions$3.AutoResetError) {
         TW3ErrorObject.ClearLastError(Self);
      }
      if (TNJCustomServer.GetActive$1(Self)) {
         TW3ErrorObject.SetLastError(Self,"Server already active error");
      } else {
         TNJCustomServer.BeforeStart(Self);
         TNJCustomServer.StartServer$(Self);
      }
   }
   /// procedure TNJCustomServer.StartServer()
   ///  [line: 142, column: 27, file: SmartNJ.Server]
   ,StartServer:function(Self) {
      TNJCustomServer.SetActive$2$(Self,true);
   }
   /// procedure TNJCustomServer.StopServer()
   ///  [line: 147, column: 27, file: SmartNJ.Server]
   ,StopServer:function(Self) {
      TNJCustomServer.SetActive$2$(Self,false);
   }
   ,Destroy:TW3ErrorObject.Destroy
   ,SetActive$2$:function($){return $.ClassType.SetActive$2.apply($.ClassType, arguments)}
   ,StartServer$:function($){return $.ClassType.StartServer($)}
   ,StopServer$:function($){return $.ClassType.StopServer($)}
};
TNJCustomServer.$Intf={
   IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TNJHTTPServer = class (TNJCustomServer)
///  [line: 102, column: 3, file: SmartNJ.Server.Http]
var TNJHTTPServer = {
   $ClassName:"TNJHTTPServer",$Parent:TNJCustomServer
   ,$Init:function ($) {
      TNJCustomServer.$Init($);
      $.OnRequest = null;
   }
   /// procedure TNJHTTPServer.Dispatch(request: JServerRequest; response: JServerResponse)
   ///  [line: 145, column: 25, file: SmartNJ.Server.Http]
   ,Dispatch:function(Self, request$1, response) {
      var LRequest = null,
         LResponse = null;
      if (Self.OnRequest) {
         LRequest = TNJHttpRequest.Create$55($New(TNJHttpRequest),Self,request$1);
         LResponse = TNJHttpResponse.Create$54($New(TNJHttpResponse),Self,response);
         try {
            Self.OnRequest(Self,LRequest,LResponse);
         } catch ($e) {
            var e$11 = $W($e);
            throw EW3Exception.CreateFmt($New(ENJHttpServerError),"Dispatch failed, system threw exception %s with message [%s]",[TObject.ClassName(e$11.ClassType), e$11.FMessage]);
         }
      }
   }
   /// procedure TNJHTTPServer.InternalSetActive(const Value: Boolean)
   ///  [line: 198, column: 25, file: SmartNJ.Server.Http]
   ,InternalSetActive:function(Self, Value$25) {
      TNJCustomServer.SetActive$2(Self,Value$25);
   }
   /// procedure TNJHTTPServer.SetActive(const Value: Boolean)
   ///  [line: 125, column: 25, file: SmartNJ.Server.Http]
   ,SetActive$2:function(Self, Value$26) {
      if (Value$26!=TNJCustomServer.GetActive$1(Self)) {
         TNJCustomServer.SetActive$2(Self,Value$26);
         try {
            if (TNJCustomServer.GetActive$1(Self)) {
               TNJCustomServer.StartServer$(Self);
            } else {
               TNJCustomServer.StopServer$(Self);
            }
         } catch ($e) {
            var e$12 = $W($e);
            TNJCustomServer.SetActive$2(Self,(!Value$26))         }
      }
   }
   /// procedure TNJHTTPServer.StartServer()
   ///  [line: 164, column: 25, file: SmartNJ.Server.Http]
   ,StartServer:function(Self) {
      var LServer = null;
      try {
         LServer = http().createServer($Event2(Self,TNJHTTPServer.Dispatch));
      } catch ($e) {
         var e$13 = $W($e);
         throw EW3Exception.CreateFmt($New(ENJHttpServerError),"Failed to create NodeJS server object, system threw exception %s with message [%s]",[TObject.ClassName(e$13.ClassType), e$13.FMessage]);
      }
      try {
         LServer.listen(TNJCustomServer.GetPort(Self),"");
      } catch ($e) {
         var e$14 = $W($e);
         LServer = null;
         throw EW3Exception.CreateFmt($New(ENJHttpServerError),"Failed to start server, system threw exception %s with message %s",[TObject.ClassName(e$14.ClassType), e$14.FMessage]);
      }
      TNJCustomServer.SetHandle(Self,LServer);
      TNJCustomServer.AfterStart(Self);
   }
   /// procedure TNJHTTPServer.StopServer()
   ///  [line: 203, column: 25, file: SmartNJ.Server.Http]
   ,StopServer:function(Self) {
      var cb = null;
      cb = function () {
         TNJHTTPServer.InternalSetActive(Self,false);
         TNJCustomServer.AfterStop(Self);
      };
      TNJCustomServer.GetHandle$1(Self).close(cb);
   }
   ,Destroy:TW3ErrorObject.Destroy
   ,SetActive$2$:function($){return $.ClassType.SetActive$2.apply($.ClassType, arguments)}
   ,StartServer$:function($){return $.ClassType.StartServer($)}
   ,StopServer$:function($){return $.ClassType.StopServer($)}
};
TNJHTTPServer.$Intf={
   IW3ErrorObject:[TW3ErrorObject.GetFailed,TW3ErrorObject.SetLastErrorF,TW3ErrorObject.SetLastError,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
   ,IW3ErrorAccess:[TW3ErrorObject.GetFailed,TW3ErrorObject.GetLastError,TW3ErrorObject.ClearLastError]
}
/// TNJServerChildClass = class (TW3HandleBasedObject)
///  [line: 43, column: 3, file: SmartNJ.Server]
var TNJServerChildClass = {
   $ClassName:"TNJServerChildClass",$Parent:TW3HandleBasedObject
   ,$Init:function ($) {
      TW3HandleBasedObject.$Init($);
      $.FParent = null;
   }
   /// constructor TNJServerChildClass.Create(Server: TNJCustomServer)
   ///  [line: 108, column: 33, file: SmartNJ.Server]
   ,Create$53:function(Self, Server$2) {
      TObject.Create(Self);
      Self.FParent = Server$2;
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TNJCustomServerResponse = class (TNJServerChildClass)
///  [line: 54, column: 3, file: SmartNJ.Server]
var TNJCustomServerResponse = {
   $ClassName:"TNJCustomServerResponse",$Parent:TNJServerChildClass
   ,$Init:function ($) {
      TNJServerChildClass.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TNJHttpResponse = class (TNJCustomServerResponse)
///  [line: 68, column: 3, file: SmartNJ.Server.Http]
var TNJHttpResponse = {
   $ClassName:"TNJHttpResponse",$Parent:TNJCustomServerResponse
   ,$Init:function ($) {
      TNJCustomServerResponse.$Init($);
   }
   /// constructor TNJHttpResponse.Create(const Server: TNJCustomServer; const ResponseObject: JServerResponse)
   ///  [line: 218, column: 29, file: SmartNJ.Server.Http]
   ,Create$54:function(Self, Server$3, ResponseObject) {
      TNJServerChildClass.Create$53(Self,Server$3);
      TW3HandleBasedObject.SetObjectHandle(Self,ResponseObject);
      return Self
   }
   /// procedure TNJHttpResponse.End(const Data: Variant)
   ///  [line: 285, column: 27, file: SmartNJ.Server.Http]
   ,End$1:function(Self, Data$27) {
      TW3HandleBasedObject.GetObjectHandle(Self).end(Data$27);
   }
   ,Destroy:TObject.Destroy
};
/// TNJCustomServerRequest = class (TNJServerChildClass)
///  [line: 51, column: 3, file: SmartNJ.Server]
var TNJCustomServerRequest = {
   $ClassName:"TNJCustomServerRequest",$Parent:TNJServerChildClass
   ,$Init:function ($) {
      TNJServerChildClass.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TNJHttpRequest = class (TNJCustomServerRequest)
///  [line: 40, column: 3, file: SmartNJ.Server.Http]
var TNJHttpRequest = {
   $ClassName:"TNJHttpRequest",$Parent:TNJCustomServerRequest
   ,$Init:function ($) {
      TNJCustomServerRequest.$Init($);
   }
   /// constructor TNJHttpRequest.Create(const Server: TNJCustomServer; const RequestObject: JServerRequest)
   ///  [line: 310, column: 28, file: SmartNJ.Server.Http]
   ,Create$55:function(Self, Server$4, RequestObject) {
      TNJServerChildClass.Create$53(Self,Server$4);
      TW3HandleBasedObject.SetObjectHandle(Self,RequestObject);
      return Self
   }
   /// function TNJHttpRequest.GetHeaders() : TJSONObject
   ///  [line: 328, column: 25, file: SmartNJ.Server.Http]
   ,GetHeaders:function(Self) {
      return TJSONObject.Create$57($New(TJSONObject),TW3HandleBasedObject.GetObjectHandle(Self).headers);
   }
   ,Destroy:TObject.Destroy
};
/// ENJServerError = class (EW3Exception)
///  [line: 36, column: 3, file: SmartNJ.Server]
var ENJServerError = {
   $ClassName:"ENJServerError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// ENJHttpServerError = class (ENJServerError)
///  [line: 37, column: 3, file: SmartNJ.Server.Http]
var ENJHttpServerError = {
   $ClassName:"ENJHttpServerError",$Parent:ENJServerError
   ,$Init:function ($) {
      ENJServerError.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3Structure = class (TObject)
///  [line: 92, column: 3, file: System.Structure]
var TW3Structure = {
   $ClassName:"TW3Structure",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TW3Structure.ReadBool(const Name: String) : Boolean
   ///  [line: 203, column: 23, file: System.Structure]
   ,ReadBool$1:function(Self, Name$5) {
      return (TW3Structure.Read$4$(Self,Name$5)?true:false);
   }
   /// function TW3Structure.ReadBytes(const Name: String) : TByteArray
   ///  [line: 154, column: 23, file: System.Structure]
   ,ReadBytes$1:function(Self, Name$6) {
      return TW3Structure.Read$4$(Self,Name$6);
   }
   /// function TW3Structure.ReadDateTime(const Name: String) : TDateTime
   ///  [line: 213, column: 23, file: System.Structure]
   ,ReadDateTime$2:function(Self, Name$7) {
      return Number(TW3Structure.Read$4$(Self,Name$7));
   }
   /// function TW3Structure.ReadFloat(const Name: String) : Float
   ///  [line: 208, column: 23, file: System.Structure]
   ,ReadFloat$1:function(Self, Name$8) {
      return Number(TW3Structure.Read$4$(Self,Name$8));
   }
   /// function TW3Structure.ReadInt(const Name: String) : Integer
   ///  [line: 198, column: 23, file: System.Structure]
   ,ReadInt$1:function(Self, Name$9) {
      return parseInt(TW3Structure.Read$4$(Self,Name$9),10);
   }
   /// function TW3Structure.ReadString(const Name: String; const Decode: Boolean) : String
   ///  [line: 190, column: 23, file: System.Structure]
   ,ReadString$3:function(Self, Name$10, Decode) {
      var Result = "";
      if (Decode) {
         Result = TString.DecodeBase64(TString,String(TW3Structure.Read$4$(Self,Name$10)));
      } else {
         Result = String(TW3Structure.Read$4$(Self,Name$10));
      }
      return Result
   }
   /// procedure TW3Structure.WriteBool(const Name: String; value: Boolean)
   ///  [line: 175, column: 24, file: System.Structure]
   ,WriteBool:function(Self, Name$11, value$1) {
      TW3Structure.Write$14$(Self,Name$11,value$1);
   }
   /// procedure TW3Structure.WriteBytes(const Name: String; const Value: TByteArray)
   ///  [line: 126, column: 24, file: System.Structure]
   ,WriteBytes:function(Self, Name$12, Value$27) {
      try {
         TW3Structure.Write$14$(Self,Name$12,TDatatype.BytesToBase64(TDatatype,Value$27));
      } catch ($e) {
         var e$15 = $W($e);
         throw EW3Exception.CreateFmt($New(EW3Structure),"Failed to write bytes to structure, system threw exception [%s] with message [%s]",[TObject.ClassName(e$15.ClassType), e$15.FMessage]);
      }
   }
   /// procedure TW3Structure.WriteDateTime(const Name: String; value: TDateTime)
   ///  [line: 185, column: 24, file: System.Structure]
   ,WriteDateTime$1:function(Self, Name$13, value$2) {
      TW3Structure.Write$14$(Self,Name$13,value$2);
   }
   /// procedure TW3Structure.WriteFloat(const Name: String; value: Float)
   ///  [line: 180, column: 24, file: System.Structure]
   ,WriteFloat:function(Self, Name$14, value$3) {
      TW3Structure.Write$14$(Self,Name$14,value$3);
   }
   /// procedure TW3Structure.WriteInt(const Name: String; value: Integer)
   ///  [line: 170, column: 24, file: System.Structure]
   ,WriteInt:function(Self, Name$15, value$4) {
      TW3Structure.Write$14$(Self,Name$15,value$4);
   }
   /// procedure TW3Structure.WriteStream(const Name: String; const Value: TStream)
   ///  [line: 138, column: 24, file: System.Structure]
   ,WriteStream:function(Self, Name$16, Value$28) {
      var LBytes$1 = [];
      if (Value$28!==null) {
         if (TStream.GetSize$1$(Value$28)>0) {
            TStream.SetPosition$(Value$28,0);
            LBytes$1 = TStream.Read(Value$28,TStream.GetSize$1$(Value$28));
         }
         TW3Structure.WriteBytes(Self,Name$16,LBytes$1);
      } else {
         throw Exception.Create($New(EW3Structure),"Failed to write stream to structure, stream was nil error");
      }
   }
   /// procedure TW3Structure.WriteString(Name: String; Value: String; const Encode: Boolean)
   ///  [line: 159, column: 24, file: System.Structure]
   ,WriteString$2:function(Self, Name$17, Value$29, Encode) {
      if (Encode) {
         Value$29 = TString.EncodeBase64(TString,Value$29);
      }
      TW3Structure.Write$14$(Self,Name$17,Value$29);
   }
   ,Destroy:TObject.Destroy
   ,Clear$2$:function($){return $.ClassType.Clear$2($)}
   ,Exists$2$:function($){return $.ClassType.Exists$2.apply($.ClassType, arguments)}
   ,LoadFromStream$2$:function($){return $.ClassType.LoadFromStream$2.apply($.ClassType, arguments)}
   ,Read$4$:function($){return $.ClassType.Read$4.apply($.ClassType, arguments)}
   ,SaveToStream$2$:function($){return $.ClassType.SaveToStream$2.apply($.ClassType, arguments)}
   ,Write$14$:function($){return $.ClassType.Write$14.apply($.ClassType, arguments)}
};
TW3Structure.$Intf={
   IW3Structure:[TW3Structure.WriteString$2,TW3Structure.WriteInt,TW3Structure.WriteBool,TW3Structure.WriteFloat,TW3Structure.WriteDateTime$1,TW3Structure.ReadString$3,TW3Structure.ReadInt$1,TW3Structure.ReadBool$1,TW3Structure.ReadFloat$1,TW3Structure.ReadDateTime$2,TW3Structure.Read$4,TW3Structure.Write$14]
   ,IW3StructureReadAccess:[TW3Structure.Exists$2,TW3Structure.ReadString$3,TW3Structure.ReadInt$1,TW3Structure.ReadBool$1,TW3Structure.ReadFloat$1,TW3Structure.ReadDateTime$2,TW3Structure.Read$4,TW3Structure.ReadBytes$1]
   ,IW3StructureWriteAccess:[TW3Structure.WriteString$2,TW3Structure.WriteInt,TW3Structure.WriteBool,TW3Structure.WriteFloat,TW3Structure.WriteDateTime$1,TW3Structure.Write$14,TW3Structure.WriteBytes,TW3Structure.WriteStream]
}
/// EW3Structure = class (EW3Exception)
///  [line: 91, column: 3, file: System.Structure]
var EW3Structure = {
   $ClassName:"EW3Structure",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// ENJNetworkError = class (EW3Exception)
///  [line: 27, column: 3, file: SmartNJ.Network]
var ENJNetworkError = {
   $ClassName:"ENJNetworkError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TNJAddressBindings = class (TW3LockedObject)
///  [line: 78, column: 3, file: SmartNJ.Network.Bindings]
var TNJAddressBindings = {
   $ClassName:"TNJAddressBindings",$Parent:TW3LockedObject
   ,$Init:function ($) {
      TW3LockedObject.$Init($);
      $.FItems = [];
   }
   /// procedure TNJAddressBindings.Clear()
   ///  [line: 172, column: 30, file: SmartNJ.Network.Bindings]
   ,Clear$4:function(Self) {
      var x$20 = 0;
      if (TW3LockedObject.GetLockState$1(Self)) {
         throw Exception.Create($New(EW3LockError),"Bindings cannot be altered while active error");
      } else {
         try {
            var $temp31;
            for(x$20=0,$temp31=Self.FItems.length;x$20<$temp31;x$20++) {
               TObject.Free(Self.FItems[x$20]);
               Self.FItems[x$20]=null;
            }
         } finally {
            Self.FItems.length=0;
         }
      }
   }
   /// destructor TNJAddressBindings.Destroy()
   ///  [line: 114, column: 31, file: SmartNJ.Network.Bindings]
   ,Destroy:function(Self) {
      if (Self.FItems.length>0) {
         TNJAddressBindings.Clear$4(Self);
      }
      TObject.Destroy(Self);
   }
   /// procedure TNJAddressBindings.ObjectLocked()
   ///  [line: 243, column: 30, file: SmartNJ.Network.Bindings]
   ,ObjectLocked$1:function(Self) {
      var x$21 = 0;
      var LAccess = null;
      var $temp32;
      for(x$21=0,$temp32=Self.FItems.length;x$21<$temp32;x$21++) {
         LAccess = $AsIntf(Self.FItems[x$21],"IW3LockObject");
         LAccess[0]();
      }
   }
   /// procedure TNJAddressBindings.ObjectUnLocked()
   ///  [line: 252, column: 30, file: SmartNJ.Network.Bindings]
   ,ObjectUnLocked$1:function(Self) {
      var x$22 = 0;
      var LAccess$1 = null;
      var $temp33;
      for(x$22=0,$temp33=Self.FItems.length;x$22<$temp33;x$22++) {
         LAccess$1 = $AsIntf(Self.FItems[x$22],"IW3LockObject");
         LAccess$1[1]();
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,ObjectLocked$1$:function($){return $.ClassType.ObjectLocked$1($)}
   ,ObjectUnLocked$1$:function($){return $.ClassType.ObjectUnLocked$1($)}
};
TNJAddressBindings.$Intf={
   IW3LockObject:[TW3LockedObject.DisableAlteration$1,TW3LockedObject.EnableAlteration$1,TW3LockedObject.GetLockState$1]
}
/// TNJAddressBinding = class (TW3OwnedLockedObject)
///  [line: 42, column: 3, file: SmartNJ.Network.Bindings]
var TNJAddressBinding = {
   $ClassName:"TNJAddressBinding",$Parent:TW3OwnedLockedObject
   ,$Init:function ($) {
      TW3OwnedLockedObject.$Init($);
   }
   /// function TNJAddressBinding.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 270, column: 28, file: SmartNJ.Network.Bindings]
   ,AcceptOwner:function(Self, CandidateObject$2) {
      return (CandidateObject$2!==null)&&$Is(CandidateObject$2,TNJAddressBindings);
   }
   /// constructor TNJAddressBinding.Create(const AOwner: TNJAddressBindings)
   ///  [line: 265, column: 31, file: SmartNJ.Network.Bindings]
   ,Create$61:function(Self, AOwner$5) {
      TW3OwnedObject.Create$13(Self,AOwner$5);
      return Self
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$13:TW3OwnedObject.Create$13
};
TNJAddressBinding.$Intf={
   IW3OwnedObjectAccess:[TNJAddressBinding.AcceptOwner,TW3OwnedObject.SetOwner,TW3OwnedObject.GetOwner]
   ,IW3LockObject:[TW3OwnedLockedObject.DisableAlteration,TW3OwnedLockedObject.EnableAlteration,TW3OwnedLockedObject.GetLockState]
}
function util() {
   return require("util");
};
/// JServerAddressResult = class (TObject)
///  [line: 64, column: 3, file: NodeJS.net]
var JServerAddressResult = {
   $ClassName:"JServerAddressResult",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
function http() {
   return require("http");
};
var __CSUniqueId = 0;
var __UNIQUE = 0;
var a$10 = 0;
var a$13 = 0;
var a$12 = 0;
var a$11 = 0;
var a$14 = 0;
var a$15 = 0;
var a$24 = null;
var a$4 = false;
var CRC_Table_Ready = false;
var CRC_Table = function () {
      for (var r=[],i=0; i<513; i++) r.push(0);
      return r
   }();
var a$150 = null;
var Server = null,
   __App = null;
var __RESERVED = [];
var __RESERVED = ["$ClassName", "$Parent", "$Init", "toString", "toLocaleString", "valueOf", "indexOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor", "destructor"].slice();
var __Parser = null;
var __CONV_BUFFER = null;
var __CONV_VIEW = null;
var __CONV_ARRAY = null;
var __SIZES = [0,0,0,0,0,0,0,0,0,0,0],
   _NAMES = ["","","","","","","","","","",""],
   __B64_Lookup = function () {
      for (var r=[],i=0; i<257; i++) r.push("");
      return r
   }(),
   __B64_RevLookup = function () {
      for (var r=[],i=0; i<257; i++) r.push(0);
      return r
   }(),
   CNT_B64_CHARSET = "";
var __SIZES = [0, 1, 1, 2, 2, 4, 2, 4, 4, 8, 8];
var _NAMES = ["Unknown", "Boolean", "Byte", "Char", "Word", "Longword", "Smallint", "Integer", "Single", "Double", "String"];
var CNT_B64_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/";
var __UniqueNumber = 0;
var __TYPE_MAP = {Boolean:undefined,Number$1:undefined,String$1:undefined,Object$2:undefined,Undefined:undefined,Function$1:undefined};
var pre_binary = [0,0],
   pre_OnOff = ["",""],
   pre_YesNo = ["",""],
   pre_StartStop = ["",""],
   pre_RunPause = ["",""];
var pre_binary = [0, 1];
var pre_OnOff = ["off", "on"];
var pre_YesNo = ["no", "yes"];
var pre_StartStop = ["stop", "start"];
var pre_RunPause = ["paused", "running"];
SetupTypeLUT();
SetupConversionLUT();
SetupBase64();
if (typeof btoa === 'undefined') {
      global.btoa = function (str) {
        return new Buffer(str).toString('base64');
      };
    }

    if (typeof atob === 'undefined') {
      global.atob = function (b64Encoded) {
        return new Buffer(b64Encoded, 'base64').toString();
      };
    }
;
switch (GetPlatform()) {
   case 1 :
      InstallDirectoryParser(TW3ErrorObject.Create$31($New(TW3Win32DirectoryParser)));
      break;
   case 2 :
      InstallDirectoryParser(TW3ErrorObject.Create$31($New(TW3PosixDirectoryParser)));
      break;
   default :
      throw Exception.Create($New(Exception),"Unsupported OS, no directory-parser for platform error");
}
;
var $Application = function() {
   Server = TServer.Create$3($New(TServer));
   TServer.Run(Server);
}
$Application();

