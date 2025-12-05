<template>
  <div class="machine-card" @click="openDetail">
    <div class="machine-header">
      {{ machine.machine_name }} ({{ machine.machine_code }})
    </div>

    <div class="machine-body">
      <div class="row">
        <div class="metric">
          <div class="value red">{{ machine.dv }} RPM</div>
          <label>DV Speed</label>
        </div>

        <div class="metric">
          <div class="value red">{{ machine.fan }} RPM</div>
          <label>Fan Speed</label>
        </div>

        <div class="metric">
          <div class="value">{{ machine.len }} m</div>
          <label>Length</label>
        </div>
      </div>

      <div class="row">
        <div class="metric">
          <div class="value red">{{ machine.tin }} °C</div>
          <label>Temp In</label>
        </div>

        <div class="metric">
          <div class="value red">{{ machine.tmid }} °C</div>
          <label>Temp Mid</label>
        </div>

        <div class="metric">
          <div class="value red">{{ machine.tout }} °C</div>
          <label>Temp Out</label>
        </div>
      </div>

      <div class="row">
        <div class="metric">
          <div class="value">{{ machine.availability }}%</div>
          <label>Availability</label>
        </div>

        <div class="metric">
          <div class="value small">{{ machine.last_update }}</div>
          <label>Last Update</label>
        </div>

        <div class="metric">
          <div class="status-pill" :class="machine.status_class">
            {{ machine.status }}
          </div>
          <label>Status</label>
        </div>
      </div>
    </div>

    <div class="machine-footer" :class="machine.status_class">
      {{ machine.status }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ machine: Object });

function openDetail() {
  frappe.set_route("Form", "Test Machines Status", props.machine.name);
}
</script>

<style scoped>
.machine-card {
  width: 330px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  transition: 0.2s;
  cursor: pointer;
}

.machine-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.machine-header {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.metric {
  text-align: center;
  width: 33%;
}

.value {
  font-size: 16px;
  font-weight: 600;
}

.value.small {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.red {
  color: #d9534f;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
}

.status-pill.running {
  color: #0a7f1f;
}

.status-pill.stop {
  color: #ad6800;
}

.status-pill.error {
  color: #b40000;
}

.machine-footer.running {
  background: #d9f7be;
  color: #237804;
}

.machine-footer.stop {
  background: #fff7e6;
  color: #ad6800;
}

.machine-footer.error {
  background: #ffd8d8;
  color: #a8071a;
}

.machine-footer {
  margin-top: 14px;
  padding: 10px;
  text-align: center;
  font-weight: 700;
  border-radius: 6px;
}
</style>
