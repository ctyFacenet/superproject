<template>
  <div class="wrapper">
    <h2 class="title">Realtime Machine Monitoring</h2>

    <div class="banner">
      <div>Current time: <b>{{ now }}</b></div>
      <div>Last update: <b>{{ lastUpdate || "_ _._" }}</b></div>
      <div>Status:
        <b :class="socketStatus === 'Listening' ? 'ok' : 'fail'">{{ socketStatus }}</b>
      </div>
    </div>

    <div class="grid">
      <MachineCardItem v-for="m in machines" :key="m.name" :machine="m" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MachineCardItem from "./MachineCardItem.vue";

const machines = ref([]);
const now = ref("");
const lastUpdate = ref("");
const socketStatus = ref("Disconnected");

let timer = null;

function updateClock() {
  now.value = new Date().toLocaleString("vi-VN", { hour12: false });
}

async function loadInitial() {
  const res = await frappe.call({
    method: "superproject.scada_&_tpm.doctype.test_machines_status.test_machines_status.get_all_machine_status"
  });

  machines.value = res.message || [];
  console.log("Initial API data:", machines.value);
}

function listenRealtime() {
  socketStatus.value = "Listening";

  frappe.realtime.on("machine_status_update", (data) => {
    console.log("Realtime data:", data);
    machines.value = data;
    lastUpdate.value = new Date().toLocaleString("vi-VN", { hour12: false });
  });
}

onMounted(() => {
  loadInitial();
  updateClock();
  timer = setInterval(updateClock, 1000);
  listenRealtime();
});

onUnmounted(() => clearInterval(timer));
</script>


<style scoped>
.wrapper {
  padding: 10px 5px;
}

.title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 10px;
  text-align: center;
}

.banner {
  display: flex;
  gap: 40px;
  margin-bottom: 15px;
  font-size: 14px;
}

.ok {
  color: green;
}

.fail {
  color: red;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
