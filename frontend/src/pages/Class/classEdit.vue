<template>
  <div class="class-edit">
    <h2 id="class-edit-title">班级编辑</h2>
    <class-manager :class_="class_" :operation="'更新'" />
  </div>
</template>

<script>
import ClassManager from "../../components/Class/ClassManager.vue";

export default {
  name: "classEdit",
  components: { ClassManager },
  data() {
    return {
      class_: {
        classId: 0,
        className: "",
        teacherId: 0,
        students: [],
      },
    };
  },
  methods: {
    fetchClassData() {
      this.getRequest("/api/class/class", {
        classId: this.$route.params.id,
      })
        .then((response) => {
          this.class_ = {
            ...this.class_,
            ...response.payload,
          };

          this.class_.students.forEach((studentId) => {
            this.getRequest("/api/user/user", {
              userId: studentId,
            }).then((response) => {
              this.class_.studentData.push({
                userId: response.payload.userId,
                username: response.payload.username,
              });
            });
          });

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
  },
  created() {
    this.fetchClassData();
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
