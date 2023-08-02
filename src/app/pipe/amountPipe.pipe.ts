import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'amount'
})
export class AmountpipePipe implements PipeTransform {

  transform(value: any): any {
    console.log(value)
    if(value){
      value= value.toFixed(0);
       var valueWithComma = value.toString();
        if(valueWithComma.length > 3){                     
            var newvaule = valueWithComma.slice(0, -3);
            if(newvaule){
                if(newvaule.length % 2 == 0){
                    var firstvalue = newvaule.split("").reverse().join("").replace(/(\d{2})/g, "$1,")
                   
                    var newane =  firstvalue.split("").reverse().join("")
                    console.log('newane',newane);
                      if(newane.startsWith(',')){
                        console.log(newane.split(''));
                        var newarray1 =[];
                        newane.split('').forEach((el,i) => {
                          if(el){
                            if(i != 0){
                                newarray1.push(el);
                                console.log(newarray1,'newarray1')
                            }
                          }  
                        });
                        newvaule = newarray1.join("");
                        
                      }
                      console.log('newane',newvaule);
                    return value = newvaule +',' + valueWithComma.slice(-3) + '.00';

                }else{
                    firstvalue = newvaule.split("").reverse().join("").replace(/(\d{2})/g, "$1,")
                    return value = firstvalue.split("").reverse().join("") + ',' + valueWithComma.slice(-3) + '.00';

                }
            }
        }else{
          return value = value + '.00';
        }


    }
  }

}
