const vm = require('vm')


function typechecker(obj, definition){
   obj.toString=function(){
     for(key in definition){
       console.log(key.concat(": ").concat(obj[key]))
     }
   }
   return new Proxy(obj, {
      set (obj, key, value) {
         if(!(key in definition))
            throw new TypeError("Not a member value")
         let type=definition[key]
         let intype=Object.prototype.toString.call(value).match(/\s([a-zA-Z]+)/)[1]
         let infulltype=Object.prototype.toString.call(value)
         switch(type) {
           case "string":
             if(!(intype === "String"))
               throw new TypeError("Incompatible type")
             break;
           case "integer":
             value=Number(value)
             if(isNaN(value) || !Number.isInteger(value))
               throw new TypeError("Incompatible type")
             break;
           case "float":
             value=Number(value)
             if(isNaN(value) || isNaN(parseFloat(value)))
               throw new TypeError("Incompatible type")
             break;
           case "boolean":
             value=Boolean(value);
             break;
           case "date":
             console.log(intype)
             if(!(infulltype == "[object Date]"))
               throw new TypeError("Incompatible type")
             break;
           case "object":
             if(!(intype == "Object"))
               throw new TypeError("Incompatible type")
             break;
           case "array":
             if(!(intype == "Array"))
               throw new TypeError("Incompatible type")
             break;
           default:
             throw new TypeError("Incompatible type")
          }

         return Reflect.set(obj, key, value)
      }
   })
}

class MRObj {
   constructor(){
      return typechecker(this, {
         mrstring: "string",
         mrinteger: "integer",
         mrfloat: "float",
         mrboolean: "boolean",
         mrobject: "object",
         mrarray: "array",
         mrdate: "date"
      })
   }
}

let test = new MRObj();
test.mrstring="hello"
test.mrinteger="1"
test.mrinteger="1.0"
test.mrfloat="1.1"
test.mrobject={}
test.mrarray=[]
test.toString();
