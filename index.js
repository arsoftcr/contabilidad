

const app=new Vue({
    el:'#apps',
    data:{
        debes:[],
        haberes:[],
        haber:'',
        debe:'',
        myDate: new Date()
    },
    methods:{
        agregardebe (){
            
            this.debes.push(`${this.debe}`)
        },
        agregarhaber(){
            this.haberes.push(`${this.haber}`)
        }

    },
    beforeMount(){
        
    }
})


