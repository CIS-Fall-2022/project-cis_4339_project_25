<template>
  <div id="report" class="report mt-8 justify-center text-center">
      <table class="w-1/2 mx-auto justify-center text-center">
        <thead>
          <tr>
            <th class="px-4 py-2" v-for="(header, index) in headers" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in data" :key="rowIndex">
            <td class="border px-4 py-2" v-for="(column, columnIndex) in row" :key="columnIndex">{{ column }}</td>
          </tr>
        </tbody>
      </table>
    </div>


</template>

<script>
export default {
  name: 'ReportTable',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  computed: {
    headers() {
      return Object.keys(this.data[0]);
    }
  }
};
</script>

<style>
td {
  white-space: nowrap;
}
</style>