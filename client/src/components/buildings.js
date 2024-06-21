export default {
    'residential': () => {
      return {
        id: 'residential',
        height: 1,
        updated: true,
        update: function() {
            this.updated = false;
        }
      }
    },
    'commercial': () => {
      return {
        id: 'commercial',
        height: 1,
        updated: true,
        update: function() {
            this.updated = false;
        }
      }
    },
    'industrial': () => {
      return {
        id: 'industrial',
        height: 1,
        updated: true,
        update: function() {
            this.updated = false;
        }
      }
    },
    'road': () => {
      return {
        id: 'road',
        updated: true,
        update: function() {
          this.updated = false;
        }
      }
    }
  }