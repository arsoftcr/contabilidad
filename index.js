

const app=new Vue({
    el:'#apps',
    data:{
        debes:[],
        haberes:[],
        haber:'',
        debe:'',
        myDate: new Date(),
        totaldebito:0,
        totalcredito:0
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
        }

    },
    beforeMount(){
        
    }
})


