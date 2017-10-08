<template>
  <div class="form-preview"><!--(click)="onViewClicked()" -->
    <template v-if="showDetails">
      <template v-if="form.uuid">Kod: {{form.uuid}}<br/></template>
      Obszar: {{form.area}}
    </template>
    <table><tbody>
      <tr class="text-center">
        <td>FD-{{form.id}}</td>
        <td colspan="3" class="bold italic">{{form.name}}</td>
      </tr>
      <tr class="text-center italic">
        <td class="bold">{{form.type}}</td>
        <td>Liczba godzin dyd.: {{form.hours}}</td>
        <td>Termin: {{form.startDate}}</td>
        <td>{{form.payment && form.payment > 0 ? (form.payment + ',00 zł') : '' }}</td><!-- TODO: formatowanie liczby -->
      </tr>
      <tr>
        <td>Zakres szkolenia</td>
        <td colspan="3" class="pre-line">{{form.scope}}</td>
      </tr>
      <tr>
        <td>Adresaci</td>
        <td colspan="3">{{form.target}}</td>
      </tr>
      <tr>
        <td>Kierownik/ Prowadzący</td>
        <td colspan="3">{{form.owner}} {{form.teacher ? (' / ' + form.teacher) : ''}} </td>
      </tr>
      <tr>
        <td>Uwagi</td>
        <td colspan="3" class="pre-line">{{form.addInfo}}</td>
      </tr>
    </tbody></table>
    <div class="index" v-if="showDetails">
        <span>Index:</span>
        <div>
          <template v-if="!form.index || form.index.length === 0">pusty</template>
          <span v-for="(item, i) in form.index" :key="i">{{item}}<br/></span>
        </div>
    </div>
  </div>
</template>

<style lang="scss">
  .form-preview {
    table {
      border-collapse: collapse;
      width: 100%;

      max-width: 800px;

      tr {
        td {
          width: 200px;
          border: 1px solid rgb(200,200,200);
          padding: 0 4px;
        }

        &:FIRST-CHILD td {
          text-align: center;
        }

        td:FIRST-CHILD {
          width: 10%;
          white-space: nowrap;
        }
      }
    }
    .index {
      >span {
        float: left;
      }
      >div {
        //display: inline-block;
        margin-left: 60px;
      }
    }
  }
</style>

<script>
  export default {
    props: {
      form: {
        type: Object,
        required: true
      },
      showDetails: {
        type: Boolean,
        default: true
      },
    },

    computed: {
      
    },
  }
</script>