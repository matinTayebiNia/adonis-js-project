export default interface mustVerifyEmail {
  /**
   * Determine if the user has verified their email address.
   *
   * @return bool
   */
  hasVerifiedEmail: Function;

  /**
   * Mark the given user's email as verified.
   *
   * @return bool
   */
  markEmailAsVerified: Function;

  /**
   * Send the email verification notification.
   *
   * @return void
   */
  sendEmailVerificationNotification: Function;
}
