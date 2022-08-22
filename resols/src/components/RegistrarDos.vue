<template>
  <v-app>
    <v-main>
      <v-form ref="forma">
        <v-text-field v-model="nombres"></v-text-field>
        <v-text-field v-model="apellidos"></v-text-field>
        <v-btn @click="addTask">add</v-btn>
      </v-form>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tasks: [],
      nombres: "",
      apellidos: "",
      correo: "",
      dni: "",
      newTask: {},
      postURL: "http://127.0.0.1:5000",
      config_request: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  },
  methods: {
    async addTask() {
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

      this.$refs.forma.reset();
    },
  },
};
</script>

<style>
.tasks {
  background-color: #cccccc;
}
</style>
