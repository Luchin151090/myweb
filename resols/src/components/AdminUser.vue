<template>
  <!-- App.vue -->

  <v-app class="administrar">
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

    <!-- Sizes your content based upon application components -->
    <v-main class="administrar">
      <div>
        <v-form class="admin" ref="creando" v-model="valid" lazy-validation>
          <h3>Crear Usuario</h3>
          <v-text-field
            required
            :rules="obligatorio"
            v-model="name"
            label="Nombre"
          ></v-text-field>
          <v-text-field
            required
            :rules="obligatorio"
            v-model="dni"
            label="Dni"
          ></v-text-field>
          <v-text-field
            required
            :rules="obligatorio"
            v-model="contraseña"
            label="Contraseña"
          ></v-text-field>
          <v-btn :disabled="!valid" @click="crear">Crear</v-btn>
        </v-form>
      </div>
      <div>
        <v-alert class="a-alerta" v-model="alert" type="success">
          Usuario creado correctamente
        </v-alert>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      config_request: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      alert: false,
      valid: true,
      name: "",
      dni: "",
      contraseña: "",
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
          route: "/administrar",
        },
      ],
      obligatorio: [(v) => !!v || "Campo obligatorio"],
    };
  },
  methods: {
    crear() {
      if (this.$refs.creando.validate()) {
        axios
          .post(
            "http://127.0.0.1:5000/usuario/insert_usuario/",
            {
              nombre: this.name,
              dni: this.dni,
              contraseña: this.contraseña,
            },
            this.config_request
          )
          .then((res) => {});
      }
      this.alert = true;
      setTimeout(() => {
        this.mostrar();
      }, 2500);
    },
    mostrar() {
      this.alert = false;
      this.$refs.creando.reset();
    },
    logout(){
      this.$router.push("/login");
    }
  },
};
</script>

<style>
.admin {
  margin-top: 100px;
  background-color: #b2ff59;
  margin-left: 300px;
  width: 400px;
  height: 300px;
  padding: 15px;
}
.administrar {
  background-color: #0091ea;
}
.a-alerta {
  width: 400px;
  top: 450px;
  margin-left: 300px;
  position: absolute;
}
</style>
