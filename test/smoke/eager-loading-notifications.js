describe('rails login', function() {
  beforeEach(function() {
    return browser.ignoreSynchronization = true;
  });
  it('should redirect to root page', function() {
    browser.get('/');
    browser.driver.findElement(by.id('user_email')).sendKeys('mohican@zwr.fi');
    browser.driver.findElement(by.id('user_password')).sendKeys('mohican123');

    var btn = element(by.id('login-button'));
    btn.click();

    browser.ignoreSynchronization = true;

    browser.get('/#/orders');
    var notifBtn = element(by.id('notification-button'));
    expect(notifBtn.isPresent()).toEqual(true);

    notifBtn.click();

    expect(true).toEqual(true);

    var notifsHolder = element(by.css('.notifications-holder'));
    expect(notifsHolder.isPresent()).toEqual(true);

    browser.wait(function() {
      return element(by.css('.alert-warning')).isPresent();
    });

    var notifMessage = element(by.css('strong'));

    expect(notifMessage.isPresent()).toEqual(true);

    expect(notifMessage.getText()).toEqual('Eager data has been partialy loaded');


    var notifMessageDismissBtn = element(by.css('.alert-warning button'));
    notifMessageDismissBtn.click();

    expect(element(by.css('.alert-warning')).isPresent()).toEqual(false);

    var previewLink = element.all(by.css('mnf-preview-grid a')).get(0);
    previewLink.getAttribute('href').then(function(hrefLink) {
      previewLink.click();

      expect(browser.getCurrentUrl()).toEqual(hrefLink);

      notifBtn = element(by.id('notification-button'));
      expect(notifBtn.isPresent()).toEqual(false);
    });
  });
});
