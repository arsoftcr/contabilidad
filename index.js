

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
        registros:[],
        options: [
            {text:'Seleccione una opcion',value:'W'},
            { text: 'Efectivo', value: 'A' },
            { text: 'Cuentas por pagar', value: 'B' },
            { text: 'Cuentas por cobrar', value: 'C' }
        ]
        
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
                this.mostrarMensaje(error,`error`)
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
                            "descripcion":this.descripcion,
                            "totaldebito":this.totaldebito,
                            "totalcredito":this.totalcredito
                        });
                       
                        
                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };
                        
                        await fetch("https://conta-ff312.firebaseio.com/AsientosDiarios.json", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                          
                            //ok
                        })
                        .catch(error => {
                            
                            this.mostrarMensaje(error,`error`)
                        });
                    } catch (error) {
                        this.mostrarMensaje(error,`error`)
                    }
                },
                 cargarAsientos(){
                    try {
                      
                        const dbref=firebase.database().ref().child('AsientosDiarios');
                      
                        dbref.on('value',(snapshot)=>{
                         
                            this.registros=[]

                            snapshot.forEach((childSnapshot)=> {
                                var k=childSnapshot.key;
                                var childData =childSnapshot.val();
                                
                                var raw =
                                    {
                                        id:k,
                                        fecha:childData.fecha,
                                        descripcion:childData.descripcion,
                                        debitos:childData.debitos,
                                        creditos:childData.creditos,
                                        totaldebitos:childData.totaldebito,
                                        totalcreditos:childData.totalcredito
                                    };
                                
                                    this.registros.push(raw)
                             
                               
                            });
                            
                            
                        });
                        
                    } catch (error) {
                        this.mostrarMensaje(error,`error`)
                    }
                },
                mostrarDetalles(e){
                    try {
                    
                        let id=e.target.getAttribute('data-id')

                        let registro=this.registros.filter((x)=>{
                            return x.id==id
                        })

                        let misdebitos=""
                        registro[0].debitos.forEach(element => {
                            misdebitos=misdebitos+`
                            <tr>
                            <td>${element.cuenta}</td>
                            <td>${element.monto}</td>
                            </tr>
                           `
                        });

                        let miscreditos=""
                        registro[0].creditos.forEach(element => {
                            miscreditos=miscreditos+`
                            <tr>
                            <td>${element.cuenta}</td>
                            <td>${element.monto}</td>
                            </tr>
                           `
                        });

                        Swal.fire({
                          
                            html: `
                            <table class="table table-responsive ">
                            <caption style="color:#2d98da;">Débitos</caption>
                            <thead>
                            <tr>
                              <th scope="col"><h3 class="display">Cuenta</h3></th>
                              <th scope="col"><h3 class="display">Monto</h3></th>
                            
                            </tr>
                          </thead>

                          <tbody>
                            ${misdebitos}

                          </tbody>
                            </table>

                            <br><br>
                            <table class="table table-responsive ">
                            <caption style="color:#2d98da;">Créditos</caption>
                            <thead>
                            <tr>
                              <th scope="col"><h3 class="display">Cuenta</h3></th>
                              <th scope="col"><h3 class="display">Monto</h3></th>
                            
                            </tr>
                          </thead>

                          <tbody>
                            ${miscreditos}

                          </tbody>
                            </table>
                            `,
                            showConfirmButton: true,
                            
                        })
                    } catch (error) {
                        this.mostrarMensaje(error,`error`)
                    }
                    
                },
               async eliminar(e){
                    try {
                        let id=e.target.getAttribute('data-id')

                        await this.fetchEliminar(id)
                    } catch (error) {
                        this.mostrarMensaje(error,`error`)
                    }
                },
                async fetchEliminar(id){
                    try {
                       
                            var requestOptions = {
                                method: 'DELETE',
                                redirect: 'follow'
                            };
                            
                            await fetch(`https://conta-ff312.firebaseio.com/AsientosDiarios/${id}.json`, requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                
                                //ok
                            })
                            .catch(error => {
                                
                                this.mostrarMensaje(error,`error`)
                            });
                        } catch (error) {
                            this.mostrarMensaje(error,`error`)
                        }
                    }
                
            },
            beforeMount(){
                 this.cargarAsientos()
            }
        })
        
        
        