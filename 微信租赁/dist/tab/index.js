import {
  VantComponent
} from '../common/component';
VantComponent({
  relation: {
    name: 'tabs',
    type: 'ancestor'
  },
  props: {
    title: String,
    textp: String,
    disabled: Boolean
  },
  data: {
    inited: false,
    active: false
  },
  watch: {
    title: 'update',
    textp: 'update',
    disabled: 'update'
  },
  mounted: function mounted() {},
  methods: {
    update: function update() {
      var parent = this.getRelationNodes('../tabs/index')[0];
      if (parent) {
        parent.updateTabs();
      }
    }
  }
});