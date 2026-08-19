import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { OrganizationRepository } from '@novu/dal';
import { EmailProviderIdEnum } from '@novu/shared';
import Stripe from 'stripe';

describe('BillingService', () => {
  let billingService: BillingService;
  let organizationRepository: OrganizationRepository;

  beforeEach(async () => {
    // Mock the OrganizationRepository
    const mockOrganizationRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: OrganizationRepository,
          useValue: mockOrganizationRepository,
        },
      ],
    }).compile();

    billingService = module.get<BillingService>(BillingService);
    organizationRepository = module.get<OrganizationRepository>(OrganizationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('reportUsage', () => {
    it('should NOT report usage if the provider is NOT a managed provider', async () => {
      await billingService.reportUsage('org_id', 'sendgrid', 'email');
      
      expect(organizationRepository.findById).not.toHaveBeenCalled();
    });

    it('should NOT report usage if organization does not have a stripeCustomerId', async () => {
      jest.spyOn(organizationRepository, 'findById').mockResolvedValue({ _id: 'org_id' } as any);
      
      await billingService.reportUsage('org_id', EmailProviderIdEnum.Notify, 'email');
      
      expect(organizationRepository.findById).toHaveBeenCalledWith('org_id');
      // Should exit early without throwing
    });

    it('should successfully report usage when managed provider and active metered subscription exist', async () => {
      // Setup DB Mock
      jest.spyOn(organizationRepository, 'findById').mockResolvedValue({
        _id: 'org_id',
        stripeCustomerId: 'cus_test_123',
      } as any);

      // Mock Stripe API
      const mockCreateUsageRecord = jest.fn().mockResolvedValue({});
      const mockStripe = {
        subscriptions: {
          list: jest.fn().mockResolvedValue({
            data: [
              {
                id: 'sub_test_123',
                items: {
                  data: [
                    {
                      id: 'si_test_metered',
                      price: {
                        recurring: {
                          usage_type: 'metered',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          }),
        },
        subscriptionItems: {
          createUsageRecord: mockCreateUsageRecord,
        },
      } as unknown as Stripe;

      // Inject the mocked Stripe client via private property casting
      (billingService as any).stripe = mockStripe;

      await billingService.reportUsage('org_id', EmailProviderIdEnum.Notify, 'email');

      expect(organizationRepository.findById).toHaveBeenCalledWith('org_id');
      expect(mockStripe.subscriptions.list).toHaveBeenCalledWith({
        customer: 'cus_test_123',
        status: 'active',
        limit: 1,
      });
      expect(mockCreateUsageRecord).toHaveBeenCalledWith('si_test_metered', {
        quantity: 1,
        timestamp: expect.any(Number),
        action: 'increment',
      });
    });

    it('should not throw if stripe throws an error (fail gracefully)', async () => {
      jest.spyOn(organizationRepository, 'findById').mockResolvedValue({
        _id: 'org_id',
        stripeCustomerId: 'cus_test_123',
      } as any);

      const mockStripe = {
        subscriptions: {
          list: jest.fn().mockRejectedValue(new Error('Stripe API Down')),
        },
      } as unknown as Stripe;

      (billingService as any).stripe = mockStripe;

      // Should not throw
      await expect(
        billingService.reportUsage('org_id', EmailProviderIdEnum.Notify, 'email')
      ).resolves.not.toThrow();
    });
  });
});
