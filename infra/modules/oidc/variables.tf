variable "name_prefix" {
  description = "Prefix for the IAM role name, e.g. \"crm-staging\"."
  type        = string
}

variable "github_org" {
  description = "GitHub org/user that owns the repo, e.g. \"hatimlukmanidevxai\"."
  type        = string
}

variable "github_repo" {
  description = "Repo name, e.g. \"origem-crm\"."
  type        = string
  default     = "origem-crm"
}

variable "branch" {
  description = "Branch this role's trust policy is scoped to -- \"main\" for the production module call, \"staging\" for the staging one."
  type        = string
}

variable "create_oidc_provider" {
  description = "Whether this module call should create the account-wide GitHub OIDC provider. True in exactly ONE environment root (see environments/staging and environments/production) -- the provider is per-AWS-account, not per-stage, and AWS rejects a second one for the same issuer URL."
  type        = bool
  default     = false
}
