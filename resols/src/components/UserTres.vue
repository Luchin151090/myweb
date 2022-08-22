<template>
  <v-app>
    <v-navigation-drawer app width="200">
      <v-navigation-drawer
        width="200"
        class="light-blue darken-3"
        dark
        permanent
      >
        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            @click="$router.push({ path: item.route })"
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
      <v-alert
        class="u-alert"
        v-model="alert"
        dismissible
        color="cyan"
        border="left"
        elevation="2"
        colored-border
        type="info"
      >
        <small
          >* Si conoce todos los datos de la Resolución, complételos, luego
          presione BUSCAR y obtener el documento con DESCARGAR.<br />* Caso
          contrario intente BUSCAR el CONCEPTO con la palabra "ASCENSO" para
          cargar todas las Resoluciones. Y obtenga la N° R.D. que necesita para
          llenar el campo, finalmente presiones BUSCAR y DESCARGAR.<br />
        </small>
      </v-alert>

      <v-card class="u-card">
        <v-card-title>Búsqueda de Resoluciones</v-card-title>
        <v-form class="u-form" ref="form" v-model="valid" lazy-validation>
          <v-text-field
            label="Concepto de la R.D."
            placeholder="VENGADOS"
            v-model="concepto"
            :rules="obligatorio"
          ></v-text-field>
          <v-text-field
            label="N° R.D."
            placeholder="09999-2022"
            v-model="rd"
          ></v-text-field>

          <v-btn
            class="u-btn1"
            :disabled="!valid"
            color="success"
            @click="buscar"
            >Buscar</v-btn
          >
          <v-btn class="u-btn2" :disabled="!valid" @click="descargar"
            >Descargar</v-btn
          >
        </v-form>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="resolu"
        :items-per-page="5"
        class="tabla-u"
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
      obligatorio: [(v) => !!v || "Campo obligatorio"],
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
        { text: "N° PROYECTO", value: "NProyecto" },
        { text: "Nombre", value: "Nombre" },
        { text: "Apellidos", value: "Apellidos" },
        { text: "E-MAIL", value: "E-mail" },
        { text: "DNI", value: "DNI" },
      ],

      valid: true,
      items: [
        { title: "Principal", icon: "mdi-view-dashboard", route: "/user3" },
        { title: "Cuenta", icon: "mdi-account-box", route: "/config" },
      ],
      concepto: "" /*CONCEPTO*/,
      rd: "" /*RD*/,
      datos_resolucion: [],
      alert: true,
    };
  },
  /* METODO CREADO */
  /*
  async created(){
  await axios
        .get("http://127.0.0.1:5000/resol/get_resol/", this.config_request)
        .then((res) => {
          this.datos_resolucion = res.data;
          this.resolu = res.data;
          console.log("buscar...", res.data);
        })
        .catch((error) => {
          console.log(error);
        });

  },*/
  /*CAMBIOS EN RESOLU*/
  methods: {
    async buscar() {
      await axios
        .get("http://127.0.0.1:5000/resol/get_resol/", this.config_request)
        .then((res) => {
          this.datos_resolucion = res.data;
          this.resolu = res.data;
          console.log("buscar...", res.data);
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
        .get(
          "http://127.0.0.1:5000/resol/get_resol/" + this.rd,
          this.config_request
        )
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
    async descargar() {
      console.log("el codigo es:", this.rd);
      axios
        .get("http://127.0.0.1:5000/resol/download/" + this.rd, {
          responseType: "blob",
        })
        .then((res) => {
          let blob = new Blob([res.data]);
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Archivo_00.pdf";
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
    logout() {
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.u-alert {
  margin-left: 150px;
  width: 800px;
}
.u-p {
  margin-top: 15px;
  font-size: 10px;
}
.u-card {
  width: 400px;
  height: 300px;
  left: 380px;
  top: 25px;
  position: absolute;
}
.u-btn1 {
  left: 0px;
  width: 150px;
}
.u-btn2 {
  width: 150px;
  left: 20px;
}
.u-form {
  padding: 5px;
  margin-left: 25px;

  height: 200px;
  width: 350px;

  background-color: #eeeeee;
}
.tabla-u {
  margin-top: 60px;
  margin-left: 100px;
  margin-right: 100px;

  position: relative;
}
.main {
  background-color: #00bfa5;
}
</style>
