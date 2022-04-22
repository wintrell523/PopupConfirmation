import popupContent from "../fixtures/popupContent.json";
import popupRequests from "../fixtures/popupRequests.json";

describe("Popup", () => {
  before(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  beforeEach(() => {
    // mock GET status to always be 200
    cy.intercept("GET", "/popup", {
      statusCode: 200,
      body: {
        message: `${popupRequests.getPopup.messageHTML}`,
      },
    }).as("getPopup");
    // mock POST status to always be 200
    cy.intercept("POST", "/popup/confirmation", {
      statusCode: 200,
      body: {
        confirmationTracked: true,
      },
    }).as("confirmPopup");
    cy.visit("/");
  });

  it("should be shown when page is loaded for first time", () => {
    cy.get("#popup").should("be.visible");
  });

  it("should close once clicked on close button", () => {
    cy.get(".modal-content .close").click();
    cy.get("#popup").should("not.be.visible");
  });

  it("should close once clicked outside the popup", () => {
    cy.get(".modal-content").click();
    cy.get("#popup").should("not.be.visible");
    cy.get("h1").should("be.visible");
  });

  it("should be not shown when page is reloaded after confirmation", () => {
    cy.get("#popup").should("be.visible");
    cy.get("button").contains("confirm").click();
    cy.get("#popup").should("not.be.visible");

    cy.reload();
    cy.get("#popup").should("not.be.visible");
  });

  it("should display correct text", () => {
    cy.get("#popup").find("h2").should("have.text", popupContent.message);
  });
});

describe("Popup with expiry time", () => {
  before(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  it("should be not shown when page is loaded but it was already confirmed in past 10 minutes", () => {
    cy.addValidConfirmToken("5");
    cy.visit("/");
    cy.get("#popup").should("not.be.visible");
  });
  it("should be shown when page is loaded and it was confirmed more than 10 minutes ago", () => {
    cy.addInvalidConfirmToken("5");
    cy.visit("/");
    cy.get("#popup").should("be.visible");
  });
});

describe("Popup requests", () => {
  before(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  it("should display the popup when GET /popup is successful", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 200,
      body: {
        message: `${popupRequests.getPopup.messageHTML}`,
      },
    }).as("getPopup");
    cy.visit("/");

    cy.wait("@getPopup");
    cy.get("#popup").should("be.visible");
    cy.get("#popupMessage").should("have.text", popupRequests.getPopup.message);
  });

  it("should not display the popup when GET /popup is not successful", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 500,
      body: {
        message: "{}",
      },
    }).as("getPopup");
    cy.visit("/");

    cy.wait("@getPopup");
    cy.get("#popup").should("not.be.visible");
  });

  it("should set expiry token after successful POST /popup/confirmation", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 200,
      body: {
        message: `${popupRequests.getPopup.messageHTML}`,
      },
    }).as("getPopup");
    cy.intercept("POST", "/popup/confirmation", {
      statusCode: 200,
      body: {
        confirmationTracked: true,
      },
    }).as("postConfirmation");

    cy.visit("/");
    cy.wait("@getPopup");
    cy.get("#confirmButton").click();
    cy.wait("@postConfirmation");
    cy.getLocalStorage("popupConfirmedTime")
      .should("exist")
      .and("not.be.empty");
    cy.get("#popup").should("not.be.visible");
  });
  it("should not set expiry token after unsuccessful POST /popup/confirmation", () => {
    cy.intercept("GET", "/popup", {
      statusCode: 200,
      body: {
        message: `${popupRequests.getPopup.messageHTML}`,
      },
    }).as("getPopup");
    cy.intercept("POST", "/popup/confirmation", {
      statusCode: 500,
      body: {
        confirmationTracked: false,
      },
    }).as("postConfirmation");

    cy.visit("/");
    cy.wait("@getPopup");
    cy.get("#confirmButton").click();
    cy.wait("@postConfirmation");
    cy.getLocalStorage("popupConfirmedTime").should("not.exist");
    cy.get("#popup").should("not.be.visible");
  });
});
