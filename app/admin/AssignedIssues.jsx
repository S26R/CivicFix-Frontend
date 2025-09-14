import StatusIssues from "../../Components/StatusIssues";


const AssignedIssues = () => (
  <StatusIssues status="assigned" title="Assigned Issues" />
);

export const unstable_settings = {
  headerTitle: "Assigned Issues",
};

export default AssignedIssues;
