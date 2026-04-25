export let AlertSeverity = /*#__PURE__*/ (function (AlertSeverity) {
  AlertSeverity["LOW"] = "Low";
  AlertSeverity["MEDIUM"] = "Medium";
  AlertSeverity["HIGH"] = "High";
  AlertSeverity["CRITICAL"] = "Critical";
  return AlertSeverity;
})({});

export let AlertStatus = /*#__PURE__*/ (function (AlertStatus) {
  AlertStatus["ACTIVE"] = "Active";
  AlertStatus["MONITORING"] = "Monitoring";
  AlertStatus["RESOLVED"] = "Resolved";
  AlertStatus["UPDATING"] = "Updating";
  return AlertStatus;
})({});
