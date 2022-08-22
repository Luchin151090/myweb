<template>
  <v-app>
    <v-main class="body">
      <div>
        <v-form ref="form" class="formu" v-model="valid" lazy-validation>
          <h4>Ingreso de Usuario</h4>
          <v-text-field
            class="entrada"
            v-model="user"
            :counter="10"
            label="Name"
            type="text"
            required
            :rules="obligatorio"
          ></v-text-field>

          <v-text-field
            class="entrada"
            v-model="dni"
            label="DNI"
            type="text"
            required
            :rules="obligatorio"
          ></v-text-field>

          <v-text-field
            class="entrada"
            v-model="pass"
            label="Contraseña"
            type="password"
            required
            :rules="obligatorio"
          ></v-text-field>

          <v-btn :disabled="!valid" class="boton" @click="ingresar">
            Ingresar
          </v-btn>
        </v-form>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return {
    postURL: "http://127.0.0.1:5000",
    config_request: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    obligatorio:[
      v=>!!v||'Campo obligatorio'
    ],
    valid: true,
    user: "",
    dni: "",
    pass: "",
    datos_usuario: [],
    datos_admins:[]
  }},

  methods: {
    async ingresar() {
      await axios
        .get("http://127.0.0.1:5000/usuario/get_usuario/", this.config_request)
        .then((res) => {
          this.datos_usuario = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
      
      await axios
      .get("http://127.0.0.1:5000/admins/get_admins/"+this.dni,this.config_request)
      .then((res)=>{
        
        this.datos_admins=res.data;
        console.log(this.datos_admins);
      })
      .catch((error)=>{
        console.log(error);
      });
    

      if (this.$refs.form.validate()) {
        
        
        for (let i = 0; i < this.datos_usuario.length; i++) {
          if (
            this.user == this.datos_usuario[i].nombre &&
            this.dni == this.datos_usuario[i].dni &&
            this.pass == this.datos_usuario[i].contraseña
          ) {
            this.$router.push("/user3");
            break;
          }
        }

           for (let i = 0; i < this.datos_admins.length; i++) {
          if (
            this.user == this.datos_admins[i].nombre &&
            this.dni == this.datos_admins[i].dni &&
            this.pass == this.datos_admins[i].contraseña
          ) {
            this.$router.push("/admin2");
            break;
          }
        }

      
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style>
.entrada input {
  color: white !important;
}
.body {
  background-color: #45b39d;
}
.formu {
  background-color: #2874a6;
  padding: 60px;
  margin: auto;
  width: 550px;
  margin-top: 100px;
}
.cone {
  background-color: #2874a6;
}

.formu h4 {
  color: white;
  font-family: "calibri";
  font-size:30px;
  text-align: center;
}
.boton {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}
</style>
