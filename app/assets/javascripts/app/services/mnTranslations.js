(function() {
  'use strict';
  var _appHeader;

  angular
      .module('servicesModule')
      .factory('mnTranslations', [mnTranslations]);

  function mnTranslations() {
    var _service = {
      appHeader: _appHeader,
    };

    return _service;
  }

  _appHeader = {
    'deliveryAndTransitionGroupTitle': {
      'fn': 'Toimitukset ja Siirtymät',
      'en': 'Delivery and Transitions',
    },
    'resourcesGroupTitle': {
      'fn': 'Resurssit',
      'en': 'Resources',
    },
    'start': {
      'fn': 'Aloitus',
      'en': 'Start',
    },
    'deliveries': {
      'fn': 'Toimitukset',
      'en': 'Deliveries',
    },
    'activities': {
      'fn': 'Siirtymät',
      'en': 'Activities',
    },
    'routes': {
      'fn': 'Routes',
      'en': 'Routes',
    },
    'design': {
      'fn': 'Suunnittelu',
      'en': 'Design',
    },
    'map': {
      'fn': 'Kartat',
      'en': 'Map',
    },
    'history': {
      'fn': 'Historia',
      'en': 'History',
    },
    'resources': {
      'fn': 'Resurssit',
      'en': 'Resources',
    },
    'timetables': {
      'fn': 'Aikataulut',
      'en': 'T`imetables',
    },
    'links': {
      'fn': 'Resurssilinkit',
      'en': 'Links',
    },
    'groups': {
      'fn': 'Resurssiryhmät',
      'en': 'Groups',
    },
    'hoursReports': {
      'fn': 'Tuntiraportit',
      'en': 'HoursReports',
    },
    'hoursAccounting': {
      'fn': 'Tuntikirjanpito',
      'en': 'HoursAccounting',
    },
    'customers': {
      'fn': 'Asiakkaat',
      'en': 'Customers',
    },
  };

})();
