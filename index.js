

const app=new Vue({
    el:'#apps',
    data:{
        debes:[],
        haberes:[],
        haber:'',
        debe:'',
        descripcion:'',
        myDate: new Date(),
        totaldebito:0,
        totalcredito:0,
        selected: 'W',
        
        options: [
            {text:'Seleccione una opcion',value:'W'},
            { text: 'Efectivo', value: 'A' },
            { text: 'Cuentas por pagar', value: 'B' },
            { text: 'Cuentas por cobrar', value: 'C' }
        ],
        secciones:`
        <section class="accordion">
        <input type="checkbox" name="collapse" id="handle1" >
        
        <h2 class="handle">
        <label for="handle1">
        <i class="fas fa-angle-right"></i>  
        {{myDate}}</label>
        </h2>
        <div class="content" v-for="item of debes"   v-for="it of haceres">
        <p><strong>Cuenta:</strong>{{item}}</p>
        <p><strong>Cuenta:</strong>{{it}}</p>
        
        </div>
        
        </section>
        `
        
    },
    methods:{
        agregardebe (){
            
            if (this.validarNumero(this.debe)) {
                
                
                if (this.selected!==`W`) {
                    let ingreso=parseFloat(this.debe)
                    
                    let total=parseFloat(this.totaldebito)
                    
                    let opcion=this.options.filter((x)=>{
                        return x.value==this.selected
                    })
                    
                    let objetoDebe={
                        cuenta:(opcion[0]??"").text,
                        monto:ingreso
                    }
                    this.debes.push(objetoDebe)
                    let suma=total+ingreso      
                    this.totaldebito=parseFloat(suma).toFixed(2) 
                } else {
                    this.mostrarMensaje(`Seleccione una cuenta`,`warning`)
                }
                
                
            } else {
                this.mostrarMensaje(`El valor ingresado no es numérico`,`warning`)
            }
            
        },
        agregarhaber(){

            if (this.validarNumero(this.haber)) {
                
                
                if (this.selected!==`W`) {
                    let ingreso=parseFloat(this.haber)
                    
                    let total=parseFloat(this.totalcredito)
                    
                    let opcion=this.options.filter((x)=>{
                        return x.value==this.selected
                    })
                    
                    let objetoCredito={
                        cuenta:(opcion[0]??"").text,
                        monto:ingreso
                    }
                    this.haberes.push(objetoCredito)
                    let suma=total+ingreso      
                    this.totalcredito=parseFloat(suma).toFixed(2) 
                } else {
                    this.mostrarMensaje(`Seleccione una cuenta`,`warning`)
                }
                
                
            } else {
                this.mostrarMensaje(`El valor ingresado no es numérico`,`warning`)
            }
          
        },
        mostrarMensaje(msg,tipo){
            
            Swal.fire({
                title: 'Atención!',
                text: msg,
                icon: tipo,
                confirmButtonText: 'OK'
            })
        },
        validarNumero(dato){
            
            try {
                if ((typeof dato!==null)&&(typeof dato!==undefined)&&
                (dato!=="")&&!isNaN(dato)) {
                    let ingreso=parseFloat(dato)
                    
                    if(typeof ingreso === 'number'&&ingreso>0){
                        
                        return `es numero`
                        
                    }
                } 
            } catch (error) {
                
            }
        },
        filterItems(presets) {
            var app = this;
            return presets.filter((preset)=> {
                return preset.presetName == app.searchQuery;
            })
        },
        reiniciar(){
            this.debes=[],
            this.haberes=[],
            this.haber='',
            this.debe='',
            this.descripcion='',
            this.myDate=new Date(),
            this.totaldebito=0,
            this.totalcredito=0,
            this.selected='W',
            this.options= [
                {text:'Seleccione una opcion',value:'W'},
                { text: 'Efectivo', value: 'A' },
                { text: 'Cuentas por pagar', value: 'B' },
                { text: 'Cuentas por cobrar', value: 'C' }
            ]
        },
       async agregar(){
           
            if (this.validacionesAsiento()) {
                await this.fetchIngreso()
            }else{
                this.mostrarMensaje(`Faltan datos`,`warning`)
            }
        },
        validacionesAsiento(){
            let valido=true

            if (this.debes.length<0) {
                valido=false
            }

            if (this.haberes.length<0) {
                valido=false
            }

            if (typeof this.descripcion===undefined
                &&typeof this.descripcion===null&&
                this.descripcion==='') {
                valido=false
            }
            if (this.totaldebito===0||this.totaldebito<0) {
                valido=false
            }
            if (this.totalcredito===0||this.totalcredito<0) {
                valido=false
            }


            return valido
      
        },
       async fetchIngreso(){
            try {
                var myHeaders = new Headers();
             
                   myHeaders.append("Content-Type", "application/json");
                   
                   var raw = JSON.stringify(
                       {
                            "fecha":this.myDate,
                            "debitos":this.debes,
                            "creditos":this.haberes,
                            "descripcion":this.descripcion
                        });

                        console.log(raw)
                   
                   var requestOptions = {
                     method: 'POST',
                     headers: myHeaders,
                     body: raw,
                     redirect: 'follow'
                   };
                   
                  await fetch("https://conta-ff312.firebaseio.com/AsientosDiarios.json", requestOptions)
                     .then(response => response.text())
                     .then(result => {
                        console.log(result)
                       Swal.fire({
                           icon: 'success',
                           title: 'Su tarea se ingresó con éxito.',
                           showConfirmButton: true,
                     
                         })
                   
                   
                     })
                     .catch(error => {
                   
                       Swal.fire({
                           icon: 'error',
                           title: 'Oops! Vaya! No hemos podido enviar los datos. Por favor intentelo más tarde.',
                           showConfirmButton: true,
                     
                         })
                     });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops! Vaya! No hemos podido enviar los datos. Por favor intentelo más tarde.',
                    showConfirmButton: true,
              
                  })
            }
        }
        
    }
})


