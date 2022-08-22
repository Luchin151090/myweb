<template>
  <v-app>
    <v-navigation-drawer app>
      <v-navigation-drawer class="blue-grey" dark permanent>
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

    <v-main class="registrar">
      <v-card class="r-card" color="blue-grey">
        <v-card-title class="r-titulo">Registro de Resoluciones</v-card-title>
        <h5>
          Nota: Las Resoluciones deben ser ingresadas con los datos correctos,
          para posteriores búsquedas.
        </h5>
      </v-card>

      <!-- MULTI STEP -->

      <v-stepper class="d-diver" v-model="e1">
        <v-stepper-header>
          <template v-for="n in steps">
            <v-stepper-step
              :key="`${n}-step`"
              :complete="e1 > n"
              :step="n"
              editable
            >
              Paso{{ n }}
            </v-stepper-step>

            <v-divider v-if="n !== steps" :key="n"></v-divider>
          </template>
        </v-stepper-header>

        <v-form ref="rform" class="r-formu" v-model="valid" lazy-validation>
          <v-stepper-content class="d-p" step="1">
            <p>Datos de la R.D.</p>
            <v-text-field
              v-model="rd"
              label="N° R.D."
              placeholder="09999-2022"
            ></v-text-field>
            <v-text-field
              v-model="nproyecto"
              label="N° Proyecto"
              placeholder="9999-2022"
            >
            </v-text-field>
            <v-text-field
              v-model="concepto"
              label="Concepto de la R.D."
              placeholder="VENGADOS"
            >
            </v-text-field>

            <v-btn color="primary" @click="verificar()"> Continue </v-btn>

            <v-btn> Cancel </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <p>Datos de la R.D.</p>
            <v-text-field
              v-model="femision"
              label="Fecha de Emision"
              placeholder="dd/mm/aaaa"
            >
            </v-text-field>
            <v-text-field
              v-model="fnotify"
              label="Fecha de Notificación"
              placeholder="dd/mm/aaaa"
            >
            </v-text-field>
            <v-text-field
              v-model="distrito"
              label="Distrito"
              placeholder="YANAHUARA"
            >
            </v-text-field>

            <v-btn color="primary" @click="e1 = 3"> Continue </v-btn>

            <v-btn> Cancel </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <p>Datos de la R.D.</p>
            <v-text-field
              v-model="descripcion"
              label="Descripcion"
              placeholder="Vengados etc."
            >
            </v-text-field>
            <v-text-field
              type="number"
              v-model="monto"
              label="Monto"
              placeholder="S/. 10000.00"
            >
            </v-text-field>
            <v-file-input
              :rules="rules"
              v-model="file"
              accept="application/pdf"
              placeholder=" PDF - Documento "
              prepend-icon="mdi-file-pdf-box"
              label=" PDF "
            ></v-file-input>
            <v-btn color="primary" @click="e1 = 4"> Continue </v-btn>

            <v-btn> Cancel </v-btn>
          </v-stepper-content>

          <v-stepper-content step="4">
            <p>Datos del Empleado de la R.D.</p>
            <v-text-field
              v-model="apellidos"
              label="Apellidos"
              placeholder="Perez Perez"
            >
            </v-text-field>
            <v-text-field
              v-model="nombres"
              label="Nombres"
              placeholder="Pepe Carlos"
            >
            </v-text-field>
            <v-text-field
              v-model="correo"
              label="E-mail"
              placeholder="perez1234@hotmail/gmail.com"
            >
            </v-text-field>
            <v-text-field v-model="dni" label="DNI" placeholder="12345678">
            </v-text-field>
            <v-btn @click="borrar">Limpiar</v-btn>
            <v-btn @click="addperson">¿Añadir persona?</v-btn>
            <v-btn :disabled="!valid" color="success" @click="registrar"
              >Completar Registro</v-btn
            >
          </v-stepper-content>
        </v-form>
      </v-stepper>

      <v-alert class="ralerta" v-model="alert" type="success"
        >¡ Registro Completado !</v-alert
      >
      <v-alert class="rerroneo" v-model="erroneo" type="error">
        N° R.D. o N° Proyecto de Resolución Repetidos! Reintente el registro con
        otros datos
      </v-alert>
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
      rules: [
        (value) =>
          !value || value.size < 200000000 || "PDF debe ser menor a 200 MB !",
      ],
      obligatorio: [(v) => !!v || "Campo obligatorio"],
      e1: 1,
      steps: 4,
      alert: false,
      erroneo: false,
      resols: [],
      countdown: 4,
      items: [
        { title: "Principal", icon: "mdi-view-dashboard", route: "/admin2" },
        {
          title: "Registrar Resoluciones",
          icon: "mdi-account-box",
          route: "/registrar",
        },
        {
          title: "Administrar Usuarios",
          icon: "mdi-gavel",
          route: "administrar",
        },
      ],
      headers: [
        {
          text: "Numero",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Nombre", value: "nombre" },
        { text: "Codigo", value: "codigo" },
        { text: "Año", value: "año" },
        { text: "Archivo", value: "archivo", sortable: false },
      ],

      file: null,
      rd: "",
      nproyecto: "",
      concepto: "",
      femision: "",
      fnotify: "",
      distrito: "",
      descripcion: "",
      monto: 0,
      apellidos: "",
      nombres: "",
      correo: "",
      dni: "",
      valid: true,
      dataresol: [],
      cons: " hoas",
    };
  },
  methods: {
    async verificar() {
      await axios
        .get("http://127.0.0.1:5000/resol/get_resol/", this.config_request)
        .then((res) => {
          this.dataresol = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
      var coincidencia = false;
      for (let i = 0; i < this.dataresol.length; i++) {
        if (
          this.rd == this.dataresol[i].NRD &&
          this.nproyecto == this.dataresol[i].NProyecto
        ) {
          coincidencia = true;

          console.log(coincidencia);
          break;
        }
      }
      if (coincidencia == true) {
        this.e1 = 1;
        this.erroneo = true;
        setTimeout(() => {
          this.errando();
        }, 5000);
        this.$refs.rform.reset();
      } else {
        this.e1 = 2;
      }
    },
    refrescar() {
      this.$refs.tablita.refresh();
    },
    async registrar() {
      if (this.$refs.rform.validate()) {
        await axios
          .post(
            "http://127.0.0.1:5000/resol/upload_person",
            {
              Nombre: this.nombres,
              Apellidos: this.apellidos,
              DNI: this.dni,
              Email: this.correo,
            },
            this.config_request
          )
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });

        await axios
          .post(
            "http://127.0.0.1:5000/resol/updata",
            {
              NRD: this.rd,
              FEmision: this.femision,
              Concepto: this.concepto,
              NProyecto: this.nproyecto,
              Distrito: this.distrito,
              FNotificacion: this.fnotify,
              Monto: this.monto,
              Descripcion: this.descripcion,
            },
            this.config_request
          )
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });

        /**/
        let formData = new FormData();
        formData.append("archivo", this.file);
        axios
          .post(
            "http://127.0.0.1:5000/resol/upload",
            formData,
            this.config_request
          )
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });

        this.alert = true;
        setTimeout(() => {
          this.mostrar();
        }, 3000);
      }
    },
    errando() {
      this.erroneo = false;
    },
    mostrar() {
      this.alert = false;
      this.$refs.rform.reset(); /*Resetea los campos del formulario*/
    },
    logout() {
      this.$router.push("/login");
    },
    async addperson() {
      
      await axios
        .post(
          "http://127.0.0.1:5000/resol/upload_person",
          {
            Nombre: this.nombres,
            Apellidos: this.apellidos,
            DNI: this.dni,
            Email: this.correo,
          },
          this.config_request
        )
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
        this.borrar();
    },
    async borrar() {
      this.nombres = "";
      this.apellidos = "";
      this.dni = "";
      this.correo = "";
    },
  },
};
</script>

<style>
.r-card {
  top: 0px;
  left: 150px;
  width: 1000px;
  height: 100px;
}
.ralerta {
  width: 700px;
  top: 10px;
  margin-left: 300px;
}
.rerroneo {
  width: 700px;
  top: 10px;
  margin-left: 300px;
}
.d-diver {
  margin-top: 15px;
  margin-left: 300px;
  width: 700px;
}
.r-form {
  padding: 30px;
}
.r-titulo {
  margin-left: 320px;
  font-size: 30px;
  color: white;
}
.r-card h5 {
  font-size: 20px;
  margin-left: 70px;
  color: white;
}

.registrar {
  background-color: #69f0ae;
}
</style>
