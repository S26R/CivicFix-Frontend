import StatusIssues from "../../Components/StatusIssues";


const RejectedIssues = () => (
  <StatusIssues status="rejected" title="Rejected Issues" />
);

export const unstable_settings = {
  headerTitle: "Rejected Issues",
};

export default RejectedIssues;
