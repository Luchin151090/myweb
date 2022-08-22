<template>
  <v-app>
    <v-navigation-drawer app> 
    
        <v-navigation-drawer class="blue-grey" dark permanent>
          <v-list>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              link
              @click="$router.push({ path:item.route })"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <template v-slot:append>
            <div class="pa-2">
              <v-btn block @click="logout"> Logout </v-btn>
            </div>
          </template>
        </v-navigation-drawer>
      
    </v-navigation-drawer>

    <v-main class="main">
      <div>
        <v-card class="a-tar1">
          <v-card-title>Búsqueda de resolución</v-card-title>
          <v-form class="a-formulario" v-model="valid" ref="form" lazy-validation>
            <v-text-field :rules="obligatorio" label="Concepto de la R.D." placeholder="VENGADOS" v-model="concepto"></v-text-field>
            <v-text-field  label="N° R.D." placeholder="09999-2022" v-model="rd"></v-text-field>
            <v-btn color="success" :disabled="!valid" class="a-btn1" @click="buscar">Buscar</v-btn>
            <v-btn class="a-btn2" :disabled="!valid" @click="descargar">Descargar</v-btn>
          </v-form>
        </v-card>
      </div>

    

      <v-data-table
        :headers="headers"
        :items="resolu"
        :items-per-page="5"
        class="tabla-a"
      ></v-data-table>
    </v-main>
  </v-app>
</template>
<script>
import axios from "axios";


export default {
  data() {
    return {
      postURL: "http://127.0.0.1:5000",
      config_request: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      obligatorio:[
        v=>!!v||'Campo obligatorio'
      ],
      archivo: [],
      resolu: [],
      headers: [
        {
          text: "Numero",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "N° RD", value: "NRD" },
        { text: "F.EMISION", value: "FEmision" },
        { text: "CONCEPTO", value: "Concepto" },
        { text: "N° PROYECTO", value: "NProyecto"},
        { text: "Nombre", value:"Nombre"},
        { text: "Apellidos",value:"Apellidos"},
        { text: "E-MAIL",value:"E-mail"},
        { text: "DNI",value:"DNI"}
      ],

      valid: true,
      items: [
        { title: "Principal", icon: "mdi-view-dashboard",route:"/admin2"},
        { title: "Registrar Resoluciones", icon: "mdi-account-box",route:"/registrar" },
        { title: "Administrar Usuarios", icon: "mdi-gavel",route:"/administrar"},
      ],
      concepto: "",
      rd: "",
      datos_resolucion: [],
    };
  },
 
  methods: {
    async buscar() {
      await axios
        .get("http://127.0.0.1:5000/resol/get_resol/", this.config_request)
        .then((res) => {
          this.datos_resolucion = res.data;
          console.log("buscar...",res.data);
        })
        .catch((error) => {
          console.log(error);
        });

      if (this.$refs.form.validate()) {
        for (let i = 0; i < this.datos_resolucion.length; i++) {
          if (
            this.concepto == this.datos_resolucion[i].Concepto ||
            this.rd == this.datos_resolucion[i].NRD
          ) {
            this.otro_metodo();
            break;
          }
        }
      }
    },
    /*UNA VEZ EXTRAIDO TODOS LOS DATOS Y COINCIDE CON EL FORM...RECIEN PASA A MOSTRARSE 
    DE FORMA ESPECIFICA EN LA TABLA (1 SOLO REGISTRO)*/
    async otro_metodo() {
      console.log("otro metodo");

      await axios
        .get("http://127.0.0.1:5000/resol/get_resol/"+this.rd, this.config_request)
        .then((res) => {
          this.resolu = res.data;
          console.log(typeof res.data);
          console.log(this.resolu);
        
        })
        .catch((error) => {
          console.log(error);
        });

        console.log(this.resolu);

    },
    async descargar(){
      console.log("el codigo es:",this.code);
      axios
        .get(
          "http://127.0.0.1:5000/resol/download/"+this.rd,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          let blob = new Blob([res.data]);
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Archivo_00.pdf';
          link.click();
          /*this.archivo = res.data;
          console.log("tipoooo",typeof this.archivo)
          var fileURL = window.URL.createObjectURL(new Blob([res.data]));
          var fileLink = document.createElement("a");

          fileLink.href = fileURL;
          document.body.appendChild(fileLink);

          fileLink.click();
          window.open(fileURL);*/
        })
        .catch((error) => {
          console.log(error);
        });
    },
    logout(){
      this.$router.push("/login");
    }
  },
};
</script>
<style>
.a-tar1 {
  width: 400px;
  height: 300px;
  left: 400px;
  top: 50px;
  position: absolute;
}
.a-btn1 {
  width:150px;
}
.a-btn2 {
  left: 50px;
  width:150px;
}
.a-formulario {
  padding:10px;
  margin-left:10px;
  margin-right:10px;
  background-color: #eeeeee;
}
.tabla-a{
  margin-top: 400px;
  margin-left:100px;
  margin-right:100px;
  position:relative;

}
.main {
  background-color: #00BFA5;
}
</style>
