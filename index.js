

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
                let ingreso=parseFloat(this.debe)

                let total=parseFloat(this.totaldebito)
                this.debes.push(ingreso)
                let suma=total+ingreso      
                this.totaldebito=parseFloat(suma).toFixed(2)    
            } else {
                this.mostrarMensaje(`El valor ingresado no es numérico`,`error`)
            }
           
        },
        agregarhaber(){
            if (this.validarNumero(this.haber)) {
                let ingreso=parseFloat(this.haber)

                let total=parseFloat(this.totalcredito)
                this.haberes.push(ingreso)
                let suma=total+ingreso      
                this.totalcredito=parseFloat(suma).toFixed(2)  
            } else {
                this.mostrarMensaje(`El valor ingresado no es numérico`,`error`)
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

                    if(typeof ingreso === 'number'){
                        
                       return `es numero`
                       
                    }
                } 
            } catch (error) {
                
            }
        },
        filterItems: function(presets) {
            var app = this;
            return presets.filter(function(preset) {
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
        agregar(){


        }

    }
})


