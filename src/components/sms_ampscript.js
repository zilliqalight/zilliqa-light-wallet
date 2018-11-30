%%[
 
/* MobileConnect variable name of above attribute  */
SET @personalisationfield = [FirstName]
 
/* Salutation to show when character count is above 160 characters */
/* Edit this part for your message salutation */
SET @alternativeSalutation = 'Hello'
 
/* Salutation to show when character count is below 160 characters */
/* Edit this part for your message salutation */
SET @defaultSalutation = CONCAT("Hello ",@personalisationfield)
 

/* Edit this part for your message content */
SET @staticContent = ', how are you here is your SMS from Esprit. http://exampleurl.com'
 
/* message text */
 
SET @messageContent= CONCAT(@defaultSalutation, @staticContent)
 
/* If message content length is over 160, change to alternativeSalutation, otherwise keep it as defaultSalutation */
 
IF length(@messageContent) > 160 then
        SET @messageContent= CONCAT(@alternativeSalutation, @staticContent)
ENDIF
 
]%%

%%=v(@messageContent)=%%