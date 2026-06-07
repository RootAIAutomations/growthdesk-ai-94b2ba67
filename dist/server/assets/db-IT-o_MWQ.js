const CLIENT_STATUSES = ["Lead", "Active", "Follow-Up", "Won", "Lost"];
const statusColor = (s) => {
  switch (s) {
    case "Lead":
      return "bg-info/15 text-info border-info/30";
    case "Active":
      return "bg-primary/15 text-primary border-primary/30";
    case "Follow-Up":
      return "bg-warning/20 text-warning-foreground border-warning/40";
    case "Won":
      return "bg-success/15 text-success border-success/30";
    case "Lost":
      return "bg-destructive/15 text-destructive border-destructive/30";
  }
};
export {
  CLIENT_STATUSES as C,
  statusColor as s
};
